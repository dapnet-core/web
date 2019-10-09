import axios from 'axios';
const GlobalMethodsPlugin = {
	install(Vue) {
		Vue.prototype.$dialogs = {};

		Vue.prototype.$dialogs.success = function(context) {
			context.$swal({
				title: context.$i18n.t('alerts.success.title'),
				text: context.$i18n.t('alerts.success.text'),
				type: 'success',
				toast: true,
				position: 'bottom-end',
				timer: 3000,
				showConfirmButton: false
			});
		};

		Vue.prototype.$dialogs.rolesEmptyError = function(context) {
			context.$swal({
				title: context.$i18n.t('alerts.rolesempty.title'),
				text: context.$i18n.t('alerts.rolesempty.text'),
				type: 'error',
				showConfirmButton: true
			});
		};

		Vue.prototype.$dialogs.deleteElement = function(context, workFunction) {
			context.$swal({
				title: context.$i18n.t('alerts.delete.title'),
				text: context.$i18n.t('alerts.delete.text'),
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#DD6B55',
				confirmButtonText: context.$i18n.t('general.yes'),
				cancelButtonText: context.$i18n.t('general.abort')
			}).then(result => {
				if (result.value) workFunction();
			});
		};

		// TODO: After moving to axois not all tested
		Vue.prototype.$dialogs.ajaxError = function(context, err) {
			console.log(err.response);
			if (err.status === 0) {
				// no connection
				context.$swal({
					title: context.$i18n.t('rest.errors.no-connection'),
					html: context.$i18n.t('rest.errors.api-unreachable'),
					type: 'error'
				});
			} else if (err.response.status === 400) {
				// constraint violation
				// TODO: Adapt to new version
				let errorText = err.body.message + ':<br>';
				if (err.body.code === 4001) {
					let jsonErrors = '<ul style="text-align:left">';
					err.body.violations.forEach(violation => {
						jsonErrors += '<li>' + violation.field + ' ' + violation.message + ' (' + violation.code + ' - ' + violation.constraint + ')</li>';
					});
					errorText += '</ul><br>' + jsonErrors;
				}

				context.$swal({
					title: err.response.data + ' (' + err.response.status + ')',
					html: errorText,
					type: 'error'
				});
			} else if (err.response.status === 403) {
				// forbidden
				context.$swal({
					title: context.$i18n.t('rest.errors.403.title'),
					html: context.$i18n.t('rest.errors.403.text'),
					type: 'error'
				});
			} else if (err.response.status === 404) {
				// not found
				context.$swal({
					title: context.$i18n.t('rest.errors.404.title'),
					html: context.$i18n.t('rest.errors.404.text'),
					type: 'error'
				});
			} else if (err.response.status === 500) {
				// not found or conflict
				if (err.response.data.error.substring(0, 3) === '409') {
					context.$swal({
						title: context.$i18n.t('rest.errors.409.title'),
						html: context.$i18n.t('rest.errors.409.text'),
						type: 'error'
					});
				} else {
					context.$swal({
						title: context.$i18n.t('rest.errors.500.title'),
						html: context.$i18n.t('rest.errors.500.text') + ' (' + err.response.data.error + ')',
						type: 'error'
					});
				}
			} else {
				// general error
				context.$swal({
					title: context.$i18n.t('rest.errors.title'),
					html: context.$i18n.t('rest.errors.http-error', { status: err.status }),
					type: 'error'
				});
			}
		};

		Vue.prototype.$dialogs.getUserDataError = function(context) {
			context.$swal({
				title: context.$i18n.t('alerts.getUserData.title'),
				html: context.$i18n.t('alerts.getUserData.text'),
				type: 'error'
			});
		};

		Vue.prototype.$dialogs.overwriteError = function(context) {
			context.$swal({
				title: context.$i18n.t('alerts.overwrite.title'),
				html: context.$i18n.t('alerts.overwrite.text'),
				type: 'error'
			});
		};

		Vue.prototype.$dialogs.colonError = function(context) {
			context.$swal({
				title: context.$i18n.t('alerts.colon.title'),
				html: context.$i18n.t('alerts.colon.text'),
				type: 'error'
			});
		};

		Vue.prototype.$dialogs.passwordError = function(context) {
			context.$swal({
				title: context.$i18n.t('alerts.password.title'),
				html: context.$i18n.t('alerts.password.text'),
				type: 'error'
			});
		};

		Vue.prototype.$dialogs.locationError = function(context) {
			context.$swal({
				title: context.$i18n.t('alerts.location.title'),
				html: context.$i18n.t('alerts.location.text'),
				type: 'error'
			});
		};

		Vue.prototype.$helpers = {};

		Vue.prototype.$helpers.getAjaxErrorMessage = function(context, response) {
			if (response.status === 0) {
				return context.$i18n.t('rest.errors.api-unreachable');
			} else if (response.status === 401 || response.status === 403) {
				return context.$i18n.t('rest.errors.permissions');
			} else {
				return context.$i18n.t('rest.errors.http-error', { status: response.status });
			}
		};

		Vue.prototype.$helpers.checkForInput = function(context, form) {
			for (let key in form) {
				if (form.hasOwnProperty(key)) {
					if (form[key].length === 0 || form[key] === '') {
						context.$swal({
							title: context.$i18n.t('alerts.input.title'),
							html: context.$i18n.t('alerts.input.text'),
							type: 'error'
						});
						return false;
					}
				}
			}
			return true;
		};

		/* UNUSED in V2
		// checks if the given data may overwrite an existing resource and denies or sends the request
		Vue.prototype.$helpers.checkForOverwritingAndSend = function(context, routeId, url, body, gotoUrl) {
			if (routeId) {
				// name in route: yes --> editing, all ok
				context.$helpers.sendData(context, url, body, gotoUrl);
			} else {
				// name in route: no --> check if existing
				context.$http.get(url).then(() => {
					// existing: yes --> error
					context.$dialogs.overwriteError(context);
				}, response => {
					// existing: no --> creating, all ok
					context.$helpers.sendData(context, url, body, gotoUrl);
				});
			}
		};
		*/

		// actually sends the given data to the server
		// Moved to axios
		Vue.prototype.$helpers.sendData = function(context, url, body, gotoUrl) {
			axios.put(url, body).then(function(response) {
				if (gotoUrl !== '') {
					context.$router.push(gotoUrl);
				}
			}).catch(function(error) {
				context.$dialogs.ajaxError(context, error);
			});
		};

		// Convert message priority string to number
		Vue.prototype.$helpers.priorityString2Number = function(context, priorityString) {
			if (priorityString === context.$i18n.t('general.priorities.lowest')) {
				return 1;
			} else if (priorityString === context.$i18n.t('general.priorities.low')) {
				return 2;
			} else if (priorityString === context.$i18n.t('general.priorities.medium')) {
				return 3;
			} else if (priorityString === context.$i18n.t('general.priorities.high')) {
				return 4;
			} else if (priorityString === context.$i18n.t('general.priorities.highest')) {
				return 5;
			} else {
				return 4;
			}
		};

		// Convert message priority number to string
		Vue.prototype.$helpers.priorityNumber2String = function(context, priorityNumber) {
			if (priorityNumber === 1) {
				return context.$i18n.t('general.priorities.lowest');
			} else if (priorityNumber === 2) {
				return context.$i18n.t('general.priorities.low');
			} else if (priorityNumber === 3) {
				return context.$i18n.t('general.priorities.medium');
			} else if (priorityNumber === 4) {
				return context.$i18n.t('general.priorities.high');
			} else if (priorityNumber === 5) {
				return context.$i18n.t('general.priorities.highest');
			} else {
				return context.$i18n.t('general.priorities.high');
			}
		};

		Vue.prototype.$helpers.generatePassword = function() {
			const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ0123456789';
			let password = '';
			for (let i = 0; i < 20; ++i) {
				password += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return password;
		};

		Vue.prototype.$helpers.zeroPad = function(number, size) {
			let s = String(number);
			while (s.length < (size || 2)) {
				s = '0' + s;
			}
			return s;
		};

		// SweetAlert2 Error Dialog
		Vue.prototype.$helpers.swalError = function(context, title, errormessage) {
			context.$swal({
				title: title,
				type: 'error',
				html: context.$i18n.t('alerts.ticketlink', {
					htmlcode: '<a href="https://support.hampager.de" target="_blank">support.hampager.de</a>'
				}) + '<br>' + errormessage,
				showConfirmButton: true,
				confirmButtonText: context.$i18n.t('alerts.ok')
			});
		};

		// SweetAlert2 Warning Dialog
		Vue.prototype.$helpers.swalWarning = function(context, title, errormessage) {
			context.$swal({
				title: title,
				type: 'warning',
				html: context.$i18n.t('alerts.ticketlink', {
					htmlcode: '<a href="https://support.hampager.de" target="_blank">support.hampager.de</a>'
				}) + '<br>' + errormessage,
				showConfirmButton: true,
				confirmButtonText: context.$i18n.t('alerts.ok')
			});
		};

		// SweetAlert2 Delete Confirm Dialog
		Vue.prototype.$helpers.swalDeleteConfirm = function(context, title, confirmButtonText) {
			return new Promise((resolve) => {
				context.$swal({
					title: title,
					text: context.$i18n.t('alerts.noUndo'),
					showConfirmButton: true,
					confirmButtonText: confirmButtonText,
					confirmButtonColor: '#F44336',
					showCancelButton: true,
					cancelButtonText: context.$i18n.t('alerts.cancel'),
					type: 'question'
				}).then((swalresult) => {
					if (swalresult.value) {
						resolve(true);
					}
				});
			});
		};

		// SweetAlert2 Version to up date Dialog
		Vue.prototype.$helpers.swalVersionUpToDate = function(context, title) {
			context.$swal({
				type: 'success',
				title: title,
				showConfirmButton: true,
				confirmButtonText: context.$i18n.t('alerts.ok')
			});
		};

		// SweetAlert2 Delete Success Dialog
		Vue.prototype.$helpers.swalDeleteSuccess = function(context, title) {
			context.$swal({
				type: 'info',
				title: title,
				showConfirmButton: true,
				confirmButtonText: context.$i18n.t('alerts.ok')
			});
		};

		// SweetAlert2 Delete Fail Dialog
		Vue.prototype.$helpers.swalDeleteFail = function(context, title, errormessage) {
			context.$swal({
				type: 'error',
				title: title,
				html: context.$i18n.t('alerts.ticketlink', {
					htmlcode: '<a href="https://support.hampager.de" target="_blank">support.hampager.de</a>'
				}) + '<br>' + errormessage,
				showConfirmButton: true,
				confirmButtonText: context.$i18n.t('alerts.ok')
			});
		};

		// Snackbar Stack info message
		Vue.prototype.$helpers.snackbarStackInfo = function(context, title) {
			context.$snackbar.show(title, {
				closeable: false
			});
		};
		// Snackbar Stack error message
		Vue.prototype.$helpers.snackbarStackError = function(context, title) {
			context.$snackbar.show(title, {
				closeable: false,
				actions: [{
					caption: context.$i18n.t('general.confirm'),
					handler(snackbar, options) {
						snackbar.close();
					}
				}]
			});
		};

		Vue.prototype.$helpers.stringToColor = function(string) {
			let hash = 0;
			for (let i = 0; i < string.length; i++) {
				hash = string.charCodeAt(i) + ((hash << 5) - hash);
				hash = hash & hash;
			}

			return 'hsl(' + hash % 360 + ', 100%, 30%)';
		};

		Vue.prototype.$helpers.getDistributedColors = function(amount) {
			let ret = [];
			let steps = Math.floor(360 / amount);
			for (let i = 1; i <= amount; i++) {
				ret.push('hsl(' + (i * steps) + ', 100%, 30%)');
			}

			return ret;
		};

		Vue.prototype.$helpers.processTransmitterGroupsTreeNode = function(currentList, currentID, currentName, completeChain, level) {
			// Parent Node: Array of nodes at this level
			// Name       : Just the ID of the node to be processed
			// ID         : The complete name-chain to be processed, dot-separated

			// Test, if Node with ID is already present
			if (this.getIndexOfListEntryWithID(currentList, currentID) === -1) {
				// If not present, add it
				currentList.push(
					{
						id: currentID,
						name: currentName
					}
				);
				// Determine, if there are more children
				if (currentID !== completeChain) {
					// Further childs exist
					// Get the index of the just added node
					let justAddedEntryIndex = this.getIndexOfListEntryWithID(currentList, currentID);
					// Add children list
					currentList[justAddedEntryIndex]['children'] = [];
				}
			}
			if (currentID !== completeChain) {
				// Further childs exist
				let individualChainEntries = completeChain.split('.');

				let thisEntryIndex = this.getIndexOfListEntryWithID(currentList, currentID);
				let childName = individualChainEntries[level + 1];
				// Build childID
				let childID = '';
				for (let i = 0; i <= level + 1; i++) {
					if (i === 0) {
						childID = individualChainEntries[i];
					} else {
						childID = childID + '.' + individualChainEntries[i];
					}
				}
				let children = this.processTransmitterGroupsTreeNode(currentList[thisEntryIndex]['children'], childID, childName, completeChain, level + 1);
				currentList[thisEntryIndex]['children'] = children;
			}
			return currentList;
		};

		Vue.prototype.$helpers.getIndexOfListEntryWithID = function(Tree, ID) {
			for (let i = 0; i < Tree.length; i++) {
				if (Tree[i]['id'] === ID) {
					return i;
				}
			}
			return -1;
		};

		Vue.prototype.$helpers.getCleanedUpTreeSelection = function(dirtySelection) {
			// Clean up selection and reduce redundant entries of leafs, it the parent node is selected
			let result = JSON.parse(JSON.stringify(dirtySelection));

			let groupIndex = 0;
			// Run until all is cleaned up
			while (groupIndex < result.length) {
				let currentGroup = result[groupIndex];
				// Find any other node, that contains this
				let searchIndex = 0;
				while (searchIndex < result.length) {
					let searchGroup = result[searchIndex];
					if (searchGroup.includes(currentGroup) &&
						(searchGroup.split('.').length > currentGroup.split('.').length)) {
						// If there are less dots in the searchGroupt than in the currentGroup, remove it
						result.splice(searchIndex, 1);
						groupIndex = -1;
					}
					searchIndex++;
				}
				groupIndex++;
			}
			return result;
		};

		Vue.prototype.$helpers.isEmpty = function(obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					return false;
				}
			}
			return JSON.stringify(obj) === JSON.stringify({});
		};
	}
};

export default GlobalMethodsPlugin;
