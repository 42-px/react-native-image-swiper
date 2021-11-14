import * as React from 'react'
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import {
  ReactNativeZoomableView,
  ZoomableViewEvent,
} from '@dudigital/react-native-zoomable-view'

import type { ImageData, BaseProps, ChangePayload } from './types'

const DEFAULT_MIN_SCALE = 0.6
const DEFAULT_MAX_SCALE = 8

const getWindow = (index: number, images: ImageData[]) => {
  if (images.length < 3) {
    return images
  }

  if (index === 0) {
    return images.slice(0, 3)
  }

  if (index === images.length - 1) {
    return images.slice(index - 2, index + 2)
  }

  return images.slice(index - 1, index + 2)
}

type CalcWindowParams = {
  images: ImageData[]
  currIndex: number
}

const calcWindow = ({ images, currIndex }: CalcWindowParams) => {
  const window =
    images.length && currIndex !== -1 ? getWindow(currIndex, images) : []
  return window
}

type SlideProps = {
  style?: StyleProp<ViewStyle>
  width: number | null
  uri: string
  scrollEnabled: boolean
  setScrollEnabled: (v: boolean) => void
  minScale: number
  maxScale: number
  hide?: boolean
}

const Slide = ({
  style,
  width,
  uri,
  scrollEnabled,
  setScrollEnabled,
  minScale,
  maxScale,
  hide = false,
}: SlideProps) => {
  const zoomableImage = React.useRef(null)

  const handleZoomChanges = (
    _: any,
    __: any,
    { zoomLevel }: ZoomableViewEvent
  ) => {
    if (zoomLevel === 1 && !scrollEnabled) {
      setScrollEnabled(true)
      return true
    }

    if (zoomLevel > 1 && scrollEnabled) {
      setScrollEnabled(false)
      return true
    }

    return true
  }

  return (
    <View style={style}>
      {!hide && (
        <ReactNativeZoomableView
          ref={zoomableImage}
          maxZoom={maxScale}
          minZoom={minScale}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders={true}
          captureEvent={true}
          onDoubleTapBefore={handleZoomChanges}
          onDoubleTapAfter={handleZoomChanges}
          onShiftingBefore={handleZoomChanges}
          onShiftingEnd={handleZoomChanges}
          onZoomBefore={handleZoomChanges}
          onZoomEnd={handleZoomChanges}
        >
          <Image
            style={{
              flex: 1,
              width: width || '100%',
              height: '100%',
            }}
            source={{
              uri,
            }}
            resizeMode="contain"
          />
        </ReactNativeZoomableView>
      )}
    </View>
  )
}

type Props = BaseProps & {
  onChange?: (payload: ChangePayload) => void
}

export const IosSwiper = ({
  onChange,
  images,
  currentId,
  minScale = DEFAULT_MIN_SCALE,
  maxScale = DEFAULT_MAX_SCALE,
}: Props) => {
  const [width, setWidth] = React.useState<number | null>(null)
  const [innerId, setInnerId] = React.useState<string | null | void>(currentId)
  const [initialIndex, setInitialIndex] = React.useState<number | void>()
  const [hideBeforeScroll, setHideBeforeScroll] = React.useState(false)
  const [scrollEnabled, setScrollEnabled] = React.useState(true)

  const scrollToItemRef = React.useRef<ImageData | null>(null)
  const imagesList = React.useRef<FlatList | null>(null)

  const layoutReady = width !== null

  const currIndex = images.findIndex((i) => i.id === innerId)
  const initialScrollIndex =
    typeof initialIndex === 'number'
      ? initialIndex
      : currIndex !== -1
      ? currIndex
      : undefined

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (
      typeof initialIndex !== 'number' &&
      typeof initialScrollIndex === 'number'
    ) {
      setInitialIndex(initialScrollIndex)
    }
  })

  const window = calcWindow({ images, currIndex })

  const scrollAfterRender = (p?: ImageData) => {
    const item = p || scrollToItemRef.current
    if (imagesList.current && item) {
      imagesList.current.scrollToItem({
        item,
        animated: false,
      })
      scrollToItemRef.current = null
    }
  }

  React.useLayoutEffect(() => {
    // yes, i did it
    setTimeout(() => {
      scrollAfterRender()
      setHideBeforeScroll(false)
    }, 30)
  }, [innerId])

  React.useEffect(() => {
    // set initial id
    if (currentId && !innerId) {
      setInnerId(currentId)
      return
    }

    // external id changed
    if (currentId && innerId !== currentId) {
      const inCurrWindow = window.some((i) => i.id === currentId)
      const currItem = images.find((i) => i.id === currentId)
      if (inCurrWindow) {
        scrollAfterRender(currItem)
      } else {
        scrollToItemRef.current = currItem || null
        setHideBeforeScroll(true)
      }
      setInnerId(currentId)
      return
    }

    // init inner id
    if (!innerId && images.length) {
      setInnerId(images[0].id)
    }
  }, [currentId, innerId, images, window])

  const emitCurrentId = (slideId: string) => {
    if (onChange) {
      onChange({ nativeEvent: { slideId } })
    }
  }

  const imageWrapStyles = StyleSheet.flatten([
    styles.imageWrap,
    {
      width: width || '100%',
    },
  ])

  const onLayout = (e: LayoutChangeEvent) => {
    const { width: wrapperWidth } = e.nativeEvent.layout
    setWidth(wrapperWidth)
  }

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {
      nativeEvent: {
        contentOffset: { x: scrollX },
      },
    } = event

    if (!width) {
      return
    }

    const nextIndex = Math.round(scrollX / width)
    const nextId = window[nextIndex].id

    if (innerId !== nextId) {
      setInnerId(nextId)
    }

    if (nextId !== currentId) {
      emitCurrentId(nextId)
    }
  }

  const renderItem = (item: ImageData) => {
    return (
      <Slide
        style={imageWrapStyles}
        width={width}
        uri={item.src}
        scrollEnabled={scrollEnabled}
        setScrollEnabled={setScrollEnabled}
        minScale={minScale}
        maxScale={maxScale}
        hide={hideBeforeScroll}
      />
    )
  }

  const showList = Boolean(
    layoutReady &&
      window.length &&
      typeof innerId === 'string' &&
      typeof initialIndex === 'number'
  )

  return (
    <View style={styles.sliderWrap} onLayout={onLayout}>
      {showList && width && (
        <FlatList
          ref={imagesList}
          data={window}
          horizontal
          pagingEnabled
          scrollEnabled={scrollEnabled}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={initialScrollIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id}
          // @ts-ignore
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: -999,
          }}
          onMomentumScrollEnd={onScroll}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  sliderWrap: {
    width: '100%',
    height: '100%',
  },
  imageWrap: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
})
