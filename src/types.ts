export type ImageData = {
  id: string
  src: string
}

export type ChangePayload = {
  nativeEvent: {
    slideId: string
  }
}

export type BaseProps = {
  images: ImageData[]
  currentId?: string | null
  minScale?: number
  maxScale?: number
}
