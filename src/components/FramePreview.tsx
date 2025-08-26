import Image from 'next/image'
import { BLUR_DATA_URL } from '@/lib/blurData'

type Props = {
  imageUrl: string
  frame: 'black' | 'walnut' | 'white'
}

export default function FramePreview({ imageUrl, frame }: Props) {
  const frameClass =
    frame === 'black' ? 'bg-black' : frame === 'walnut' ? 'bg-[#7b5a3e]' : 'bg-white border'
  return (
    <div className={`p-3 ${frameClass} rounded-md`}> {/* frame */}
      <div className="bg-white p-3"> {/* mat */}
        <div className="relative aspect-square overflow-hidden">
          <Image src={imageUrl.replace(/%2F/g, '/')} alt="Framed preview" fill sizes="(max-width: 768px) 60vw, 30vw" className="object-contain" placeholder="blur" blurDataURL={BLUR_DATA_URL} quality={80} />
        </div>
      </div>
    </div>
  )
}
