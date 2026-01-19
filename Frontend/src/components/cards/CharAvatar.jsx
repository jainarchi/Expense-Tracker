

const CharAvatar = ({ fullName}) => {

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
  
    const initials = words.map((word) => word[0]).join("");
    return initials.toUpperCase().substring(0, 2);
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-normal uppercase text-2xl h-18 w-18`}
    >
      {getInitials(fullName)}
    </div>
  );
};

export default CharAvatar;