export const validateEmail = (email) =>{
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email)
}

export const validatePassword = (password) =>{
    const regex = /^[a-zA-Z0-9]{8,}$/;
    return regex.test(password) ; 
}

export const validateName = (name) =>{
    return name.length > 3 
}

export const addThousandsSeparator = (num) =>{
   if(num == null || isNaN(num)) return ;

   const [integerPart , fractionalPart] = num.toString().split(".");
   const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g , "," );


   return fractionalPart
   ? `${formattedInteger}.${fractionalPart}`
   : formattedInteger;

}