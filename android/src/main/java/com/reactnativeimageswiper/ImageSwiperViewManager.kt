package com.reactnativeimageswiper

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder

class ImageSwiperViewManager : SimpleViewManager<SwiperView>() {
  override fun getName(): String {
    return "ImageSwiperView"
  }

  override fun createViewInstance(context: ThemedReactContext): SwiperView {
    return SwiperView(context)
  }

  override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any>? {
    return MapBuilder.builder<Any, Any>()
      .put(
        "swiperIdChange",
        MapBuilder.of(
          "phasedRegistrationNames",
          MapBuilder.of("bubbled", "onChange")
        )
      )
      .build() as MutableMap<String, Any>
  }

  @ReactProp(name = "minScale")
  fun setMinScale(view: SwiperView, minScale: Double) {
    if (minScale is Double) {
      view.setMinScale(minScale.toDouble())
    }
  }

  @ReactProp(name = "maxScale")
  fun setMaxScale(view: SwiperView, maxScale: Double) {
    if (maxScale is Double) {
      view.setMaxScale(maxScale.toDouble())
    }
  }


  @ReactProp(name = "images")
  fun setSlides(view: SwiperView, imagesProp: ReadableArray) {
    val images = ArrayList<ImageData>()

    for (index in 0 until imagesProp.size()) {
      val image = imagesProp.getMap(index)
      val id = image?.getString("id")
      val src = image?.getString(("src"))
      if (id !== null && src !== null) {
        images.add(ImageData(id, src))
      }
    }

    view.updateImagesByNewState(images)
  }

  @ReactProp(name = "currentId")
  fun setCurrentId(view: SwiperView, currentId: String?) {
    if (currentId is String) {
      view.setCurrentSlide(currentId)
    }
  }
}
