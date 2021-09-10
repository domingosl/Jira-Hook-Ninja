const Swal = require('sweetalert2');

module.exports.show = async () => {


    const {value: flow } = await Swal.fire({
        title: 'New Flow',
        html: `<form id="new-flow-form">
      
      <p>Give your new Flow a nice name so can remember what it does</p>
      
      <input type="text" name="name" class="swal2-input" placeholder="Name" maxlength="25">
      
      </form>
    `,
        preConfirm: async () => {
            const formData = new FormData(Swal.getPopup().querySelector('#new-flow-form'));
            return formData.get('name')
        },
        confirmButtonText: 'Save Flow',
        focusConfirm: false
    });

    return flow;

};
