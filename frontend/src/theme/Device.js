const query = (type, size) => `(${type}-width: ${size})`

const Device = {

    phoneS   : { min : query('min', '320px'), max : query('max', '320px') },
    phoneM  : { min : query('min', '375px'), max : query('max', '375px') },
    phoneL   : { min : query('min', '425px'), max : query('max', '425px') },

    tabletS   : { min : query('min', '625px'), max : query('max', '625px') },
    tabletM  : { min : query('min', '768px'), max : query('max', '768px') },
    tabletL   : { min : query('min', '920px'), max : query('max', '920px') },
    
    desktopS   : { min : query('min', '1024px'), max : query('max', '1024px') },
    desktopM  : { min : query('min', '1374px'), max : query('max', '1374px') },
    desktopL   : { min : query('min', '1662px'), max : query('max', '1662px') }

}

export default Device