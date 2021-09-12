import Swal from "sweetalert2";

module.exports.show = async (flowList, cb) => {

    const {value: key} = await Swal.fire({
        title: 'Select your flow',
        html: '',
        input: 'select',
        allowEnterKey: false,
        inputOptions: flowList,
        inputPlaceholder: 'Select your flow',
        showCancelButton: true,
        willClose: () => typeof cb === 'function' && cb(null)
    });

    typeof cb === 'function' && cb(key);
}