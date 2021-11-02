import React from 'react'
import { Route } from "react-router-dom";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux"; // redux store'dan bir bilgi almak istediğimiz zaman mutlaka "useSelector" kullanılır.
import Fallback from "../Fallback";

//"...rest" index.js dosyası içerisinde yer alan "PrivateRoot" etiketinin içerisinde bulunan "exact" ve "path" komutlarını da al demek oluyor! 
const PrivateRoute = ({ children, ...rest }) => {

    const auth = useSelector(state => state.firebase.auth); //profil bilgisini almak için useState kullanıldı.
    return (
        <Route
            {...rest}
            render={() =>
                isLoaded(auth) && !isEmpty(auth) ? children : <Fallback />
            }
        />
    );
};

export default PrivateRoute
