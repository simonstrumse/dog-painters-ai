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
        <div className="aspect-square overflow-hidden">
          <img src={imageUrl} alt="Framed preview" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  )
}

