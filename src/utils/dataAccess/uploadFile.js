import axios from 'axios'

export default function () {
  return new Promise((resolve, reject) => {
    let input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.style.visibility = 'hidden'
    document.body.append(input)
    input.onchange = async (e) => {
      let form = new FormData()
      form.append('file', e.target.files[0])
      let data = await axios({
        url: '/crm-fd/api/upload/file',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params: form,
        data: form
      })
      resolve(data.data)
      document.body.removeChild(input)
    }
    input.click()
  })
}
