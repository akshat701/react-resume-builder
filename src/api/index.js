import { doc,onSnapshot, setDoc,query,collection, orderBy } from "firebase/firestore"
import { auth,db} from "../config/firebase.config"
export const getUserDetail = () =>{
    return new Promise((resolve, reject)=>{
        const unsubscribe = auth.onAuthStateChanged((userCred)=>{
            if(userCred){
                const userData = userCred.providerData[0]
                
                const unsubscribe = onSnapshot(doc(db,"users",userData?.uid),(_doc)=>{
                    if(_doc.exists()){
                        resolve(_doc.data())
                    }
                    else{
                        setDoc(doc(db,"user",userData?.uid),userData).then(() => {
                            resolve(userData);
                        });
                    }
                });

                return unsubscribe;
            }
            else{
                reject(new Error("user is not authenticated"))
            }

            // make sure to unsubscribe from the listner 
            unsubscribe()
        }) 
    })
}

export const getTemplates = () =>{
    return new Promise((resolve, reject) => {
        const templateQuery = query(
            collection(db, "templates"),
            orderBy("timestamp","asc")
        );
        const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
            const templates = querySnap.docs.map((doc) => doc.data());
            resolve(templates);
        });
        return unsubscribe;
    })
}