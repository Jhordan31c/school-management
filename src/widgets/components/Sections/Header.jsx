export const Header = ({head, para}) => {
    return (
      <div>
        <p className="font-medium text-3xl mb-2 text-center">{head}</p>
        <p className="text-slate-400 mt-8 text-center">{para}</p>
      </div>
    )
  }