# react-native-image-swiper

bi-directional swiper for ReactNative

# Features

* Android/iOS support
* zoom image
* correct behavior when adding new images

# Why does the world need another swiper?

if you use/wrote a some swiper on ReactNative, you must have suffered. The big problem starts when you start adding items dynamically to the beginning of the list. This happens because the `maintainVisibleContentPosition` prop is not supported in ScrollView (Flatlist) on android (only iOS support). And the default behavior of ScrollView when adding new items is to shift to the beginning. This leads to a terrible UX. 

The standard solution for android in this situation is to use `RecyclerView`. That's exactly what we did by implementing a native swiper module for Android (The iOS implementation is based on Flatlist).


# Is it customizable?

Just a little bit. We added only some basic props because we needed a quick solution for our own project. But it works! If you need a simple image swiper that won't break when you add new images, this is the one for you.

Perhaps we will customize this component in the future.


## Installation

```sh
npm install @42px/react-native-image-swiper
```

## Usage

```tsx
import React from 'react'
import { Button, StyleSheet, View } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { RnImageSwiper } from '@42px/react-native-image-swiper'


const sampleImages = [
  'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg',
  'https://cdn02.nintendo-europe.com/media/images/06_screenshots/games_5/nintendo_switch_download_software_2/nswitchds_lostinrandom/NSwitchDS_LostInRandom_06.jpg',
  'https://cdn02.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_download_software_1/H2x1_NSwitchDS_LostInRandom_image1600w.jpg',
]

type CreateImagesParams = CreateImageParams & {
  count: number
  width: number
  height: number
}

const createImages = ({ count, width, height }: CreateImagesParams) => {
  const images = []
  for (let i = 0; i < count; i++) {
    images.push({
      id: randomString(10),
      src: sampleImages[Math.floor(Math.random() * sampleImages.length)],
    })
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
  const [currentId, setCurrentId] = React.useState<string | void>(initImages[0].id)

  const addToStart = () => {
    const newImages = createImages({ count: 5, width: 300, height: 900 })
    setImages([...newImages, ...images])
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

  return (
    <View style={{ width: '100%', flexDirection: 'column' }}>
      <View style={styles.sliderWrap}>
        <RnImageSwiper
          currentId={currentId}
          onChange={setCurrentId}
          images={images}
          minScale={0.6}
          maxScale={8}
        />
      </View>
      <View style={styles.buttons}>
        <Button title="add to start" onPress={addToStart} />
        <Button title="add to end" onPress={addToEnd} />
        <Button title="to last item" onPress={toLastItem} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sliderWrap: {
    width: '100%',
    height: 400,
    backgroundColor: 'green',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
```