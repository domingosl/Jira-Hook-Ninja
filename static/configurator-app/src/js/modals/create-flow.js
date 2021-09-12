const Swal = require('sweetalert2');

module.exports.show = async () => {


    const {value: flow } = await Swal.fire({
        title: 'New Flow',
        allowEnterKey: false,
        html: `      
      <p>Give your new Flow a nice name so can remember what it does</p>
      <input id="create-flow-name-input" type="text" name="name" class="swal2-input" placeholder="Name" maxlength="25">
      
    `,
        preConfirm: async () => {
            const el = Swal.getPopup().querySelector('#create-flow-name-input');
            return el.value;
        },
        confirmButtonText: 'Save Flow',
        focusConfirm: false
    });

    return flow;

};
