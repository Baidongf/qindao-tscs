export function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)")
    if(arr=document.cookie.match(reg)) {
        return unescape(arr[2])
    } else {
        return null
    }
}

export function setCookie(name, value, days) {
  var date=new Date();
  date.setDate(date.getDate()+days);
  document.cookie=name+'='+value+';expires='+date;
}

export const cookieUtil = {
  getCookie,
  setCookie
}
