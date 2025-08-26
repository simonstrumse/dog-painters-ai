import Image from 'next/image'

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
          <Image src={imageUrl} alt="Framed preview" fill sizes="(max-width: 768px) 60vw, 30vw" className="object-contain" />
        </div>
      </div>
    </div>
  )
}
