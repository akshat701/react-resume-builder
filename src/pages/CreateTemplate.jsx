import React, { useEffect, useState } from 'react'
import { FaTrash, FaUpload } from 'react-icons/fa6';
import { PuffLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import {deleteObject, getDownloadURL, ref, uploadBytes, uploadBytesResumable} from 'firebase/storage'
import { db, storage } from '../config/firebase.config';
import { upload } from '@testing-library/user-event/dist/upload';
import { adminIds, initialTags } from '../utilis/helpers';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import useTemplates from '../hooks/useTemplates';
import useUser from '../hooks/useTemplates';
import { remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
const CreateTemplate = () => {
    const [formData,setFormData] = useState({
        title : "",
        imageURL :null,
    });
    const [imageAsset,setImageAsset] = useState({
        isImageLoading : false,
        uri : null,
        progress : 0
    })

    const [selectedTags,setSelectedTags] = useState([])


    const {
        data : templates,
        isError : templatesIsError, 
        isLoading : templatesIsLoading, 
        refetch: templatesRefetch
         } = useTemplates();

    const {data : user, isLoading } = useUser();

    const navigate = useNavigate();

    const handleInputChange = (e) =>{
        const {name,value} = e.target;
        setFormData((prevRec) => ({ ...prevRec, [name]:value}));
    };

    const handleFileSelect = async (e) => {
        setImageAsset((prevAsset) => ({...prevAsset, isImageLoading: true}));
        const file = e.target.files[0];

        if(file && isAllowed(file)){
            const storageRef = ref(storage,`Templates/${Date.now()}-${file.name}`);

            const uploadTask = uploadBytesResumable(storageRef,file);

            uploadTask.on('state_changed',
        (snapshot) => {
            setImageAsset((prevAsset) => ({...prevAsset,progress :
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            }));
        },
        (error) => {
            if(error.message.includes("storage/unauthorized")){
                toast.error(`Error : Authorization Revoked`);
            }
            else{
                toast.error(`Error : ${error.message}`);
            }
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                setImageAsset((prevAsset) => ({...prevAsset,
                    uri: downloadURL,
                    })); 
            })
            toast.success("Image Uploaded");
            setInterval(() => {
               setImageAsset((prevAsset) => ({
                ...prevAsset,
                isImageLoading: false,
               })) ;
            }, 2000);
        }
        )
        }
        else{
            toast.info("Invalid file format");
        }

    };

    const deleteAnImageObject = async () => {
        setInterval(() => {
            setImageAsset((prevAsset) => ({
             ...prevAsset,
             progress : 0,
             uri : null,
             
            })) ;
         }, 2000);
        
        const deleteRef = ref(storage, imageAsset.uri);
        deleteObject(deleteRef).then(()=>{
            toast.success("Image removed");
            
        })
    }

    const isAllowed = (file) =>{
        const allowedTypes = ["image/jpeg", "image/jpg","image/png"]
        return allowedTypes.includes(file.type)
    }

    const handleSelectTags = (tag) =>{
        if(selectedTags.includes(tag)){
            setSelectedTags(selectedTags.filter(selected => selected !==tag))
        }else{
            setSelectedTags([...selectedTags,tag]);
        }
    };

    const pushToCloud = async () => {
        const timestamp = serverTimestamp()
        const id = `${Date.now()}`
        const _doc = {
            _id :id,
            title : formData.title,
            imageURL : imageAsset.uri,
            tags : selectedTags,
            name: templates && templates.length>0 
                ? `Templates${templates.length +1}`
                : "Template1",
            timestamp:timestamp,
        };

        await setDoc(doc(db,"templates", id), _doc).then(() => {
            setFormData((prevData) => ({ ...prevData,title: "", imageURL:""}));
            setImageAsset((prevAsset) => ({ ...prevAsset,uri:null}));
            setSelectedTags([]);
            templatesRefetch();
            toast.success("Data pushed to the cloud")
        }).catch(err => {
            toast.error(`Error :${err.message}`);
        })
    };
 // function to remove the data from the cloud
    const removeTemplate = async(template) =>{
        const deleteRef = ref(storage,template?.imageURL);
        await deleteObject(deleteRef).then(async()=>{
            await deleteDoc(doc(db,"templates",template?._id)).then(() => {
                toast.success("Template deleted from the cloud")
                templatesRefetch();
            }).catch(err => {
                toast.error(`Error :${err.message}`);
            })
        })
    };

    useEffect(() =>{
        if(!isLoading && !adminIds.includes(user?.uid)){
            navigate("/", { replace : true})
        }
    }, [user, isLoading])

  return (
    <div className='he18'> 
      {/* left container */}
      <div className='he19'>
        <div className='he21'>
            <p className='he22'>Create a new Template</p>
        </div>
        {/* template id section */}
        <div className='he23'>
            <p className='he24'>TempID : {" "}</p>
            <p className='he25'>
                {templates && templates.length>0 
                ? `Templates${templates.length +1}`
                : "Template1"}
                </p>
        </div>
        {/*template title sectiob */}
        <input className='he26'
        type='text' 
        name='title'
        placeholder='Template Title' 
        value={formData.title}
        onChange={handleInputChange}
        />
        {/*file uploader section */}

      <div className='he27'> {imageAsset.isImageLoading ? (
        <React.Fragment>
            <div className='he28'>
                <PuffLoader className='he29' />
                <p>
                    {imageAsset?.progress.toFixed(2)}%
                </p>
            </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
            {!imageAsset?.uri ? (
                <React.Fragment>
                    <label className='he30'>
                        <div className='he31'>
                            <div className='he32'>
                                <FaUpload className='he33'/>
                                <p className='he34'>Click to upload</p>
                            </div>
                        </div>

                        <input type='file' className='he35' accept='.jpeg,.jpg,.png' onChange={handleFileSelect}/>
                    </label>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className='he36'>
                        <img
                        src={imageAsset?.uri}
                        className='he37'
                        loading='lazy'
                        alt=''
                        />

                        {/* delete action */}
                        <div className='he38' onClick={deleteAnImageObject}>
                            <FaTrash className='he39' />
                        </div>

                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
      )
      
    }</div>

    {/* tags */}
    <div className='he40'>
        {initialTags.map((tag,i)=>(
            <div key={i} className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""}`} onClick={() => handleSelectTags(tag)}>
                <p>{tag}</p>
            </div>
        ))}
    </div>

    {/* buttn*/}
    <button type='button' className='he41' onClick={pushToCloud}>Save</button>
      </div>

      

      {/* right container */}

      <div className='he20'>
      {templatesIsLoading ? (<React.Fragment>
        <div className='he42'>
            <PuffLoader color='#498FCD' size={40} />
        </div>
      </React.Fragment>
    ) : (
        <React.Fragment>
            {templates && templates.length>0 ? (
                <React.Fragment>
                    <div className='he47'>
                    {templates?.map(template => (
                        <div key={template._id} className='he45'>
                            <img src={template?.imageURL} alt='' className='he46'/>

                            {/* delete action */}
                        <div className='he38' onClick={()=> removeTemplate(template)}>
                            <FaTrash className='he39' />
                        </div>
                        </div>
                    ))}
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className='he43'>
                        <PuffLoader color='#498FCD' size={40} />
                        <p className='he44'>No data</p>
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    )}
      </div>
    </div>
  )
}

export default CreateTemplate

