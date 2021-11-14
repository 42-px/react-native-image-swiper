import React from 'react'
import {
  requireNativeComponent,
  Platform,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { IosSwiper } from './ios-swiper'
import type { BaseProps, ChangePayload } from './types'

type AndroidProps = BaseProps & {
  onChange?: (payload: ChangePayload) => void
  style?: StyleProp<ViewStyle>
}

const SwiperComp =
  Platform.OS === 'android'
    ? requireNativeComponent<AndroidProps>('ImageSwiperView')
    : IosSwiper

type Props = BaseProps & {
  onChange?: (payload: string) => void
}

export const RnImageSwiper = (props: Props) => {
  const { onChange, ...restProps } = props

  const proxyClearEventVal = (e: ChangePayload) => {
    if (onChange) {
      onChange(e.nativeEvent.slideId)
    }
  }

  return (
    <SwiperComp
      {...restProps}
      onChange={proxyClearEventVal}
      style={styles.slider}
    />
  )
}

const styles = StyleSheet.create({
  slider: {
    minWidth: '100%',
    height: '100%',
  },
})
