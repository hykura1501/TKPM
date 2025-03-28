const data = [
    {
      countryCode: "VN",
      countryName: "Việt Nam",
      pattern: "^(0|\\+84)[3|5|7|8|9][0-9]{8}$",
      example: "0901234567 hoặc +84901234567",
      prefix: "+84",
    },
    {
      countryCode: "US",
      countryName: "Hoa Kỳ",
      pattern: "^(\\+1)?[0-9]{10}$",
      example: "1234567890 hoặc +11234567890",
      prefix: "+1",
    },
    {
      countryCode: "JP",
      countryName: "Nhật Bản",
      pattern: "^(\\+81|0)[0-9]{9,10}$",
      example: "0123456789 hoặc +81123456789",
      prefix: "+81",
    },
    {
      countryCode: "FR",
      countryName: "Pháp",
      pattern: "^(\\+33|0)[1-9][0-9]{8}$",
      example: "0123456789 hoặc +33123456789",
      prefix: "+33",
    },
  ];
  
  const jsonString = JSON.stringify(data);
  console.log(jsonString);