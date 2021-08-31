import { postApiNoToken } from '../../data/RemoteData';
import { loginApi } from '../Url';
import { Cabang } from './Cabang';
import { LoginTokenRequest } from './LoginTokenRequest';
import { LoginTokenResponse } from './LoginTokenResponse';
import { User } from './User';

export function doLogin(username: string, password: string, 
    onSuccess: () => void, onError: (status: string) => void){
    let reqBody = {
        username: username,
        password: password
    }
    postApiNoToken<LoginTokenRequest, LoginTokenResponse>(loginApi, reqBody)
    .then((val: LoginTokenResponse) => {
        storeAccessToken(val.token)
        storeUser(val.user)
        storeCabang(val.cabang)
        onSuccess()
    })
    .catch((response: any) => {
        console.log(response)
        onError(response)
    })
}

export function storeAccessToken(accessToken: string){
    localStorage.setItem('access', JSON.stringify(accessToken));
}

export function getAccessToken(): String {
    let accessTokenStr = localStorage.getItem('access') as string
    let accessToken: string = JSON.parse(accessTokenStr)
    return accessToken
}

export function storeCabang(cabang: Cabang){
    localStorage.setItem('cabang', JSON.stringify(cabang));
}

export function getCabang(): Cabang{
    let cabangJson = localStorage.getItem('cabang') as string
    let cabang: Cabang = JSON.parse(cabangJson)
    return cabang
}

export function storeUser(user: User){
    localStorage.setItem('user', JSON.stringify(user));
}

export function getUser(): User{
    let userJson = localStorage.getItem('user') as string
    let user: User = JSON.parse(userJson);
    return user
}

export function clearUserAndCabang() {
    localStorage.clear();
}