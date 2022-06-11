let pageData = {
    productName:"Book a ticket",
    productDescription:"Fly yourself to the moon!",
    imageSrc:[
        "images/asteroid.jpg",
        "images/fantasy.jpg",
        "images/space.jpg",
        "images/spaceship.jpg"
    ],
    h2ClassController:{
        centered:true,
        colorFont:true
    },
    pStyleController:{
        color:'blue',
        'margin-left':'50px',
        'font-size':'20px',
        'font-style':'italic'
    },
    imageStyleController:{
        margin:'auto',
        display:'block',
        width:'50%'
    },
    imageAlt:"photo from space",

    productClasses:[
        {
            name:'Coach',
            price:125000,
            seatsAvailable:20,
            earlyBird:true
        },
        {
            name:'Business',
            price:275000,
            seatsAvailable:6,
            earlyBird:true
        },
        {
            name:'Coach',
            price:430000,
            seatsAvailable:2,
            earlyBird:false
        }
    ]

};

const App = Vue.createApp({
    data(){
        return pageData;
    }
});

App.mount("#app");