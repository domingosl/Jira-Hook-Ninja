const Swal = require('sweetalert2');

module.exports.show = async (cb) => {

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        allowEnterKey: false
    });

    if (result.isConfirmed) {
        cb();
    }

};

