export const ipfsUpload = async (data) => {
  try {
    const formData = new FormData();
    formData.append('File', data.file);
    const pictureResult = await data.fleek.upload( {
        apiKey: process.env.NEXT_PUBLIC_FLEEK_API_KEY,
        apiSecret: process.env.NEXT_PUBLIC_FLEEK_API_SECRET,
        key: data.imagePath + uuid(),
        data: formData.get('File'),
      });
    let metaData = {
        name: data.state.name,
        description: data.state.description,
        media_uri_image: pictureResult.publicUrl,
        properties: {
            lattitude: data.state.lattitude,
            longitude: data.state.longitude,
            city: data.state.city,
            state: data.state.state,
            country: data.state.country,
            zip: data.state.zip,
            isLetterBox: data.state.isLetterBox,
            isStamp: data.state.isStamp
        }
    };
    const metaDataResult = await data.fleek.upload( {
        apiKey: process.env.NEXT_PUBLIC_FLEEK_API_KEY,
        apiSecret: process.env.NEXT_PUBLIC_FLEEK_API_SECRET,
        key: data.metadataPath + uuid(),
        data: JSON.stringify(metaData),
      });
    console.log(metaDataResult);
    return metaDataResult;
    
  } catch (e) {
    console.log(e);
  }
    
};

export const getUserStamp = async (data) => {
  let stampList = [];
  let userStamp = await data.contract.stampHeldBy(data.account); //returns tokenId
  userStamp = userStamp.toNumber();
  console.log("userStamp = ", userStamp);
  let userResources = await data.contract.getActiveResources(userStamp); //returns array of resources
  if(userResources.length > 0) {
    console.log('userResources: ' + userResources[0]); //resource ID
    const{resourceID, metadataURI} = await data.contract.getResource(userResources[0]);
    console.log('metadataURI: ' + metadataURI);
    if(metadataURI) {
      //get stamps
      await fetch(metadataURI)
      .then(response => response.json())
      .then(data => {
          stampList.push({
            id: userStamp,
            src: data.media_uri_image,
            name: data.name,
            description: data.description,
            city: data.properties.city,
            country: data.properties.country,
            lattitude: data.properties.lattitude,
            longitude: data.properties.longitude,
            state: data.properties.state,
            zip: data.properties.zip
          })
      });
    }
  }
  return stampList;
};

export const uuid = () => {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf('/') + 1); // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
};