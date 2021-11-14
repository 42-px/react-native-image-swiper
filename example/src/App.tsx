import React from 'react'
import {
  Button,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { RnImageSwiper } from '@42px/react-native-image-swiper'

function randomString(length = 10) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const imagesSources = [
  'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg',
  'https://cdn02.nintendo-europe.com/media/images/06_screenshots/games_5/nintendo_switch_download_software_2/nswitchds_lostinrandom/NSwitchDS_LostInRandom_06.jpg',
  'https://cdn02.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_download_software_1/H2x1_NSwitchDS_LostInRandom_image1600w.jpg',
  'https://lizaonair.com/random/images/preview.jpg',
  'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F13%2F2015%2F04%2F05%2Ffeatured.jpg&q=85',
  'https://hatrabbits.com/wp-content/uploads/2016/12/rare-combinaties.jpg',
  ,
]

// const getRandImageSrc = () => images[Math.floor(Math.random() * images.length)]

type CreateImageParams = {
  width: number
  height: number
}

const createImage = ({ width, height }: CreateImageParams) => {
  return {
    id: randomString(10),
    src: `https://picsum.photos/${width}/${height}?t=${randomString(10)}`,
  }
}

type CreateImagesParams = CreateImageParams & {
  count: number
}

const createImages = ({ count, width, height }: CreateImagesParams) => {
  const images = []
  for (let i = 0; i < count; i++) {
    images.push(createImage({ width, height }))
  }
  return images
}

const initImages = (() => {
  return createImages({ count: 4, width: 200, height: 800 })
})()

type ImageData = {
  id: string
  src: string
}

export default () => {
  const [images, setImages] = React.useState<ImageData[]>(initImages)
  const [currentId, setCurrentId] = React.useState<string | void>(undefined)

  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  const addToStart = () => {
    const newImages = createImages({ count: 5, width: 300, height: 900 })
    const updated = [...newImages, ...images]
    setImages(updated)
  }

  const addToEnd = () => {
    const newImages = createImages({ count: 5, width: 1000, height: 800 })
    setImages([...images, ...newImages])
  }

  const toLastItem = () => {
    if (!images.length) {
      return
    }

    const { id } = images[images.length - 1]
    setCurrentId(id)
  }

  /*
  const deleteCurrent = () => {
    if (currentId) {
      setImages(images.filter((i) => i.id !== currentId))
    }
  }
  */

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{ width: '100%', flexDirection: 'column' }}>
        <View style={styles.sliderWrap}>
          <RnImageSwiper
            currentId={currentId || undefined}
            onChange={setCurrentId}
            images={images}
            minScale={0.6}
            maxScale={8}
          />
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Button title="add items to start" onPress={addToStart} />
          <Button title="add items to end" onPress={addToEnd} />
          <Button title="to last item" onPress={toLastItem} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  wrap: {
    flex: 1,
  },
  slider: {
    minWidth: '100%',
    height: '100%',
  },
  sliderWrap: {
    width: '100%',
    height: 400,
    backgroundColor: 'green',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
})
