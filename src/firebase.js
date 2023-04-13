import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, addDoc } from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAW-Y4ZppmbGuTLOBvZcnZW7FSUl8h7QSc",
    authDomain: "clicker-d9960.firebaseapp.com",
    projectId: "clicker-d9960",
    storageBucket: "clicker-d9960.appspot.com",
    messagingSenderId: "210877169615",
    appId: "1:210877169615:web:d6f7ecfe78d97d7da41cba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function updateClicks(country, city) {
    // get the country document and update the clicks and the country name
    // if the country doesn't exist, create it

    const countriesRef = collection(db, 'country');
    const querySnapshot = await getDocs(countriesRef);

    // Check if the country exists
    const countryDoc = querySnapshot.docs.find(doc =>
        (doc.data().name === country && doc.data().city === city)
        || (doc.data().name === null && doc.data().city === null));

    if (countryDoc) {
        // Update the document and return the updated document
        await updateDoc(countryDoc.ref, { name: country ? country: 'unknown', city: city ? city : 'unknown', clicks: countryDoc.data().clicks + 1 });

    } else {
        // Create the document
        const unknown = querySnapshot.docs.find(doc =>
            (doc.data().name === 'unknown' && doc.data().city === 'unknown'));
        if (unknown) {
            await updateDoc(unknown.ref, { clicks: unknown.data().clicks + 1 });
            return getData();
        }

        await addDoc(countriesRef, { name: country, city: city, clicks: 1 });
    }
    return getData();

}

// get the country data
export async function getData() {
    const countriesRef = collection(db, 'country');
    const countriesSnapshot = await getDocs(countriesRef);
    return countriesSnapshot.docs.map(doc => doc.data());
}

export default db;