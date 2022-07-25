export async function ipfsUpload(data) {
  try {
    const formData = new FormData();
    formData.append('File', data.file);
    const pictureResult = await data.fleek.upload( {
        apiKey: process.env.REACT_APP_FLEEK_API_KEY,
        apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
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
        apiKey: process.env.REACT_APP_FLEEK_API_KEY,
        apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
        key: data.metadataPath + uuid(),
        data: JSON.stringify(metaData),
      });
    console.log(metaDataResult)
    return metaDataResult;
    
  } catch (e) {
    console.log(e);
  }
    
}

export async function getUserStamp(data) {
  
  let userStamp = await data.contract.stampHeldBy(data.account); //returns tokenId
  userStamp = userStamp.toNumber();
  console.log("userStamp = ", userStamp);
  let userResources = await data.contract.getFullResources(userStamp); //returns array of resources
  let userJSON = userResources[0].metadataURI;
  console.log("userJson = ", userJSON);

  let stampList = [];
  //get stamps
  await fetch(userJSON)
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
  return stampList;
}

function uuid() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf('/') + 1); // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
}