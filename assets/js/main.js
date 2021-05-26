let productModal = null
let delModal = null
const app = {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/',
      apiPath: 'chiayu',
      isLoading: false,
      isUpload: false,
      isUploads: [],
      isAdd: false,
      isOpen: {
        id: null,
        open: false,
      },
      isAddCategory: false,
      products: [],
      totalAmount: '',
      productsCategory: [],
      pagination: {},
      totalAmount: 0,
      tempCategory: '',
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  mounted() {},
  methods: {
    checkUser() {
      axios
        .post(`${this.apiUrl}api/user/check`)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            this.getData()
          } else {
            alert('驗證錯誤，請重新登入')
            window.location = 'index.html'
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getData(page = 1) {
      this.isLoading = true
      axios
        .get(`${this.apiUrl}api/${this.apiPath}/admin/products?page=${page}`)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            this.isLoading = false
            this.products = res.data.products
            this.pagination = res.data.pagination
          } else {
            alert(res.data.messages)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      axios
        .get(`${this.apiUrl}api/${this.apiPath}/admin/products/all`)
        .then((res) => {
          if (res.data.success) {
            let productsAll = Object.values(res.data.products)
            this.totalAmount = productsAll.length
            productsAll.forEach((product) => {
              if (!this.productsCategory.includes(product.category)) {
                this.productsCategory.push(product.category)
              }
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    openCollapse(id) {
      if (this.isOpen.id == id) {
        this.isOpen.open = !this.isOpen.open
      } else {
        this.isOpen.id = id
        this.isOpen.open = true
      }

      let collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
      let collapseList = collapseElementList.map((collapseEl, key) => {
        if (key == id) {
          return new bootstrap.Collapse(collapseEl, { toggle: false }).toggle()
        } else {
          return new bootstrap.Collapse(collapseEl, { toggle: false }).hide()
        }
      })
    },
    openModal(type, item) {
      if (type === 'add') {
        this.tempProduct = {
          imagesUrl: [],
        }
        this.isAdd = true
        productModal.show()
      } else if (type === 'edit') {
        this.tempProduct = {
          ...item,
          imagesUrl: item.imagesUrl == undefined ? [] : [...item.imagesUrl],
        }
        this.isAdd = false
        productModal.show()
      } else if (type === 'delete') {
        this.tempProduct = { ...item }
        delModal.show()
      }
    },
    changeStatus(item) {
      this.tempProduct = {
        ...item,
      }
      this.updateProduct()
    },
    addCategory() {
      this.productsCategory.push(this.tempCategory)
      alert(`新增${this.tempCategory}分類`)
      this.tempCategory = ''
      this.isAddCategory = false
    },
    deleteImage(id) {
      this.tempProduct.imagesUrl.splice(id, 1)
      this.isUploads.pop()
    },
    createImage() {
      if (this.tempProduct.imagesUrl == undefined) {
        this.tempProduct.imagesUrl = []
      }
      this.tempProduct.imagesUrl.push('')
      this.isUploads.push(false)
    },
    clearTemp() {
      this.tempProduct = {
        imagesUrl: [],
      }
    },
    addProduct() {
      let data = {
        data: this.tempProduct,
      }
      this.isLoading = true
      axios
        .post(`${this.apiUrl}api/${this.apiPath}/admin/product`, data)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            this.isLoading = false
            alert(res.data.message)
            this.clearTemp()
            productModal.hide()
            this.getData()
          } else {
            alert(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    updateProduct() {
      let data = {
        data: this.tempProduct,
      }
      this.isLoading = true
      axios
        .put(`${this.apiUrl}api/${this.apiPath}/admin/product/${this.tempProduct.id}`, data)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            this.isLoading = false
            alert(res.data.message)
            this.clearTemp()
            productModal.hide()
            this.getData(this.pagination.current_page)
          } else {
            alert(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    deleteProduct() {
      this.isLoading = true
      axios
        .delete(`${this.apiUrl}api/${this.apiPath}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          console.log(res)
          if (res.data.success) {
            this.isLoading = false
            alert(res.data.message)
            delModal.hide()
            this.getData(this.pagination.current_page)
          } else {
            alert(res.data.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    uploadImage(key) {
      const e = window.event
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file-to-upload', file)
      if (key === 'main') {
        this.isUpload = true
      } else {
        this.isUploads[key] = true
      }
      axios.post(`${this.apiUrl}api/${this.apiPath}/admin/upload`, formData).then((res) => {
        console.log(res)
        if (res.data.success) {
          if (key === 'main') {
            this.tempProduct.imageUrl = res.data.imageUrl
            this.isUpload = false
          } else {
            this.tempProduct.imagesUrl[key] = res.data.imageUrl
            this.isUploads[key] = false
          }
        }
      })
    },
  },
  created() {
    const cookitToken = document.cookie.replace(/(?:(?:^|.*;\s*)chiayuToken\s*\=\s*([^;]*).*$)|^.*$/, '$1')
    axios.defaults.headers.common['Authorization'] = cookitToken

    this.checkUser()
    this.isLoading = true
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'))
    delModal = new bootstrap.Modal(document.getElementById('deleteModal'))
  },
}

Vue.createApp(app).mount('#app')
