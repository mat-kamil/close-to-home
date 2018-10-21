(function(Vue, http){
	const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;
	Vue.component('upload',{
		name: 'Upload',
		template: '#template-upload',
		data() {
			return {
				uploadedFiles: [],
				uploadError: null,
				currentStatus: null,
				uploadFieldName: 'csv',
				fileCount: 0
			}
		},
		computed: {
			isInitial() { return this.currentStatus === STATUS_INITIAL; },
			isSaving()  { return this.currentStatus === STATUS_SAVING;  },
			isSuccess() { return this.currentStatus === STATUS_SUCCESS; },
			isFailed()  { return this.currentStatus === STATUS_FAILED;  }
		},
		methods: {
			reset() {
				// reset form to initial state
				this.currentStatus = STATUS_INITIAL;
				this.uploadedFiles = [];
				this.uploadError = null;
			},
			save(formData) {
				// upload data to the server
				this.currentStatus = STATUS_SAVING;
				
				http.post('http://localhost:3000/users', formData)
					.then(x => {
						this.uploadedFiles = [].concat(x);
						this.currentStatus = STATUS_SUCCESS;
					})
					.catch(err => {
						this.uploadError = err.response;
						this.currentStatus = STATUS_FAILED;
					});
			},
			filesChange(fieldName, fileList) {
				// handle file changes
				const formData = new FormData();
				
				if (!fileList.length) return;
				
				// append the files to FormData
				Array
					.from(Array(fileList.length).keys())
					.map(x => {
						formData.append(fieldName, fileList[x], fileList[x].name);
					});
				
				// save it
				this.save(formData);
			}
		},
		mounted() {
			this.reset();
		},
	});
	let app = new Vue({
		el: '#app',
		data: { }
	});
})(Vue, axios);