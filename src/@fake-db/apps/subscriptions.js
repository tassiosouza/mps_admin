// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Utils Import
import { getDateRange } from 'src/@core/utils/get-daterange'

const now = new Date()
const currentMonth = now.toLocaleString('default', { month: 'short' })

const data = {
  subscriptions: [
    {
      id: 4987,
      subscriptionDate: `13 ${currentMonth} ${now.getFullYear()}`,
      address: '7777 Mendez Plains',
      email: 'don85@johnson.com',
      country: 'USA',
      phone: '(616) 865-4180',
      name: 'Jordan Stevenson',
      mealPlan: 'Software Development',
      latitude: 3428,
      avatar: '',
      avatarColor: 'primary',
      status: 'Paid',
      longitude: '$724',
      deliveryInstruction: `23 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4988,
      subscriptionDate: `17 ${currentMonth} ${now.getFullYear()}`,
      address: '04033 Wesley Wall Apt. 961',
      company: 'Mccann LLC and Sons',
      email: 'brenda49@taylor.info',
      country: 'Haiti',
      phone: '(226) 204-8287',
      name: 'Stephanie Burns',
      mealPlan: 'UI/UX Design & Development',
      latitude: 5219,
      avatar: '/images/avatars/1.png',
      status: 'Downloaded',
      longitude: 0,
      deliveryInstruction: `15 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4989,
      subscriptionDate: `19 ${currentMonth} ${now.getFullYear()}`,
      address: '5345 Robert Squares',
      company: 'Leonard-Garcia and Sons',
      email: 'smithtiffany@powers.com',
      country: 'Denmark',
      phone: '(955) 676-1076',
      name: 'Tony Herrera',
      mealPlan: 'Unlimited Extended License',
      latitude: 3719,
      avatar: '/images/avatars/2.png',
      status: 'Paid',
      longitude: 0,
      deliveryInstruction: `03 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4990,
      subscriptionDate: `06 ${currentMonth} ${now.getFullYear()}`,
      address: '19022 Clark Parks Suite 149',
      company: 'Smith, Miller and Henry LLC',
      email: 'mejiageorge@lee-perez.com',
      country: 'Cambodia',
      phone: '(832) 323-6914',
      name: 'Kevin Patton',
      mealPlan: 'Software Development',
      latitude: 4749,
      avatar: '/images/avatars/3.png',
      status: 'Sent',
      longitude: 0,
      deliveryInstruction: `11 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4991,
      subscriptionDate: `08 ${currentMonth} ${now.getFullYear()}`,
      address: '8534 Saunders Hill Apt. 583',
      company: 'Garcia-Cameron and Sons',
      email: 'brandon07@pierce.com',
      country: 'Martinique',
      phone: '(970) 982-3353',
      name: 'Mrs. Julie Donovan MD',
      mealPlan: 'UI/UX Design & Development',
      latitude: 4056,
      avatar: '/images/avatars/4.png',
      status: 'Draft',
      longitude: '$815',
      deliveryInstruction: `30 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4992,
      subscriptionDate: `26 ${currentMonth} ${now.getFullYear()}`,
      address: '661 Perez Run Apt. 778',
      company: 'Burnett-Young PLC',
      email: 'guerrerobrandy@beasley-harper.com',
      country: 'Botswana',
      phone: '(511) 938-9617',
      name: 'Amanda Phillips',
      mealPlan: 'UI/UX Design & Development',
      latitude: 2771,
      avatar: '',
      avatarColor: 'secondary',
      status: 'Paid',
      longitude: 0,
      deliveryInstruction: `24 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4993,
      subscriptionDate: `17 ${currentMonth} ${now.getFullYear()}`,
      address: '074 Long Union',
      company: 'Wilson-Lee LLC',
      email: 'williamshenry@moon-smith.com',
      country: 'Montserrat',
      phone: '(504) 859-2893',
      name: 'Christina Collier',
      mealPlan: 'UI/UX Design & Development',
      latitude: 2713,
      avatar: '',
      avatarColor: 'success',
      status: 'Draft',
      longitude: '$407',
      deliveryInstruction: `22 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4994,
      subscriptionDate: `11 ${currentMonth} ${now.getFullYear()}`,
      address: '5225 Ford Cape Apt. 840',
      company: 'Schwartz, Henry and Rhodes Group',
      email: 'margaretharvey@russell-murray.com',
      country: 'Oman',
      phone: '(758) 403-7718',
      name: 'David Flores',
      mealPlan: 'Template Customization',
      latitude: 4309,
      avatar: '/images/avatars/5.png',
      status: 'Paid',
      longitude: '-$205',
      deliveryInstruction: `10 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4995,
      subscriptionDate: `26 ${currentMonth} ${now.getFullYear()}`,
      address: '23717 James Club Suite 277',
      company: 'Henderson-Holder PLC',
      email: 'dianarodriguez@villegas.com',
      country: 'Cambodia',
      phone: '(292) 873-8254',
      name: 'Valerie Perez',
      mealPlan: 'Software Development',
      latitude: 3367,
      avatar: '/images/avatars/6.png',
      status: 'Downloaded',
      longitude: 0,
      deliveryInstruction: `24 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4996,
      subscriptionDate: `15 ${currentMonth} ${now.getFullYear()}`,
      address: '4528 Myers Gateway',
      company: 'Page-Wise PLC',
      email: 'bwilson@norris-brock.com',
      country: 'Guam',
      phone: '(956) 803-2008',
      name: 'Susan Dickerson',
      mealPlan: 'Software Development',
      latitude: 4776,
      avatar: '/images/avatars/7.png',
      status: 'Downloaded',
      longitude: '$305',
      deliveryInstruction: `02 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4997,
      subscriptionDate: `27 ${currentMonth} ${now.getFullYear()}`,
      address: '4234 Mills Club Suite 107',
      company: 'Turner PLC Inc',
      email: 'markcampbell@bell.info',
      country: 'United States Virgin Islands',
      phone: '(716) 962-8635',
      name: 'Kelly Smith',
      mealPlan: 'Unlimited Extended License',
      latitude: 3789,
      avatar: '/images/avatars/8.png',
      status: 'Partial Payment',
      longitude: '$666',
      deliveryInstruction: `18 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4998,
      subscriptionDate: `31 ${currentMonth} ${now.getFullYear()}`,
      address: '476 Keith Meadow',
      company: 'Levine-Dorsey PLC',
      email: 'mary61@rosario.com',
      country: 'Syrian Arab Republic',
      phone: '(523) 449-0782',
      name: 'Jamie Jones',
      mealPlan: 'Unlimited Extended License',
      latitude: 5200,
      avatar: '/images/avatars/1.png',
      status: 'Partial Payment',
      longitude: 0,
      deliveryInstruction: `17 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 4999,
      subscriptionDate: `14 ${currentMonth} ${now.getFullYear()}`,
      address: '56381 Ashley Village Apt. 332',
      company: 'Hall, Thompson and Ramirez LLC',
      email: 'sean22@cook.com',
      country: 'Ukraine',
      phone: '(583) 470-8356',
      name: 'Ruben Garcia',
      mealPlan: 'Software Development',
      latitude: 4558,
      avatar: '/images/avatars/2.png',
      status: 'Paid',
      longitude: 0,
      deliveryInstruction: `01 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5000,
      subscriptionDate: `21 ${currentMonth} ${now.getFullYear()}`,
      address: '6946 Gregory Plaza Apt. 310',
      company: 'Lambert-Thomas Group',
      email: 'mccoymatthew@lopez-jenkins.net',
      country: 'Vanuatu',
      phone: '(366) 906-6467',
      name: 'Ryan Meyer',
      mealPlan: 'Template Customization',
      latitude: 3503,
      avatar: '/images/avatars/3.png',
      status: 'Paid',
      longitude: 0,
      deliveryInstruction: `22 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5001,
      subscriptionDate: `30 ${currentMonth} ${now.getFullYear()}`,
      address: '64351 Andrew Lights',
      company: 'Gregory-Haynes PLC',
      email: 'novakshannon@mccarty-murillo.com',
      country: 'Romania',
      phone: '(320) 616-3915',
      name: 'Valerie Valdez',
      mealPlan: 'Unlimited Extended License',
      latitude: 5285,
      avatar: '/images/avatars/4.png',
      status: 'Partial Payment',
      longitude: '-$202',
      deliveryInstruction: `02 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5002,
      subscriptionDate: `21 ${currentMonth} ${now.getFullYear()}`,
      address: '5702 Sarah Heights',
      company: 'Wright-Schmidt LLC',
      email: 'smithrachel@davis-rose.net',
      country: 'Costa Rica',
      phone: '(435) 899-1963',
      name: 'Melissa Wheeler',
      mealPlan: 'UI/UX Design & Development',
      latitude: 3668,
      avatar: '/images/avatars/5.png',
      status: 'Downloaded',
      longitude: '$731',
      deliveryInstruction: `15 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5003,
      subscriptionDate: `30 ${currentMonth} ${now.getFullYear()}`,
      address: '668 Robert Flats',
      company: 'Russell-Abbott Ltd',
      email: 'scott96@mejia.net',
      country: 'Congo',
      phone: '(254) 399-4728',
      name: 'Alan Jimenez',
      mealPlan: 'Unlimited Extended License',
      latitude: 4372,
      avatar: '',
      avatarColor: 'warning',
      status: 'Sent',
      longitude: '-$344',
      deliveryInstruction: `17 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5004,
      subscriptionDate: `27 ${currentMonth} ${now.getFullYear()}`,
      address: '55642 Chang Extensions Suite 373',
      company: 'Williams LLC Inc',
      email: 'cramirez@ross-bass.biz',
      country: 'Saint Pierre and Miquelon',
      phone: '(648) 500-4338',
      name: 'Jennifer Morris',
      mealPlan: 'Template Customization',
      latitude: 3198,
      avatar: '/images/avatars/6.png',
      status: 'Partial Payment',
      longitude: '-$253',
      deliveryInstruction: `16 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5005,
      subscriptionDate: `30 ${currentMonth} ${now.getFullYear()}`,
      address: '56694 Eric Orchard',
      company: 'Hudson, Bell and Phillips PLC',
      email: 'arielberg@wolfe-smith.com',
      country: 'Uruguay',
      phone: '(896) 544-3796',
      name: 'Timothy Stevenson',
      mealPlan: 'Unlimited Extended License',
      latitude: 5293,
      avatar: '',
      avatarColor: 'error',
      status: 'Past Due',
      longitude: 0,
      deliveryInstruction: `01 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5006,
      subscriptionDate: `10 ${currentMonth} ${now.getFullYear()}`,
      address: '3727 Emma Island Suite 879',
      company: 'Berry, Gonzalez and Heath Inc',
      email: 'yrobinson@nichols.com',
      country: 'Israel',
      phone: '(236) 784-5142',
      name: 'Erik Hayden',
      mealPlan: 'Template Customization',
      latitude: 5612,
      avatar: '/images/avatars/7.png',
      status: 'Downloaded',
      longitude: '$883',
      deliveryInstruction: `12 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5007,
      subscriptionDate: `01 ${currentMonth} ${now.getFullYear()}`,
      address: '953 Miller Common Suite 580',
      company: 'Martinez, Fuller and Chavez and Sons',
      email: 'tatejennifer@allen.net',
      country: 'Cook Islands',
      phone: '(436) 717-2419',
      name: 'Katherine Kennedy',
      mealPlan: 'Software Development',
      latitude: 2230,
      avatar: '/images/avatars/8.png',
      status: 'Sent',
      longitude: 0,
      deliveryInstruction: `19 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5008,
      subscriptionDate: `22 ${currentMonth} ${now.getFullYear()}`,
      address: '808 Sullivan Street Apt. 135',
      company: 'Wilson and Sons LLC',
      email: 'gdurham@lee.com',
      country: 'Nepal',
      phone: '(489) 946-3041',
      name: 'Monica Fuller',
      mealPlan: 'Unlimited Extended License',
      latitude: 2032,
      avatar: '/images/avatars/1.png',
      status: 'Partial Payment',
      longitude: 0,
      deliveryInstruction: `30 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5009,
      subscriptionDate: `30 ${currentMonth} ${now.getFullYear()}`,
      address: '25135 Christopher Creek',
      company: 'Hawkins, Johnston and Mcguire PLC',
      email: 'jenny96@lawrence-thompson.com',
      country: 'Kiribati',
      phone: '(274) 246-3725',
      name: 'Stacey Carter',
      mealPlan: 'UI/UX Design & Development',
      latitude: 3128,
      avatar: '/images/avatars/2.png',
      status: 'Paid',
      longitude: 0,
      deliveryInstruction: `10 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5010,
      subscriptionDate: `06 ${currentMonth} ${now.getFullYear()}`,
      address: '81285 Rebecca Estates Suite 046',
      company: 'Huynh-Mills and Sons',
      email: 'jgutierrez@jackson.com',
      country: 'Swaziland',
      phone: '(258) 211-5970',
      name: 'Chad Davis',
      mealPlan: 'Software Development',
      latitude: 2060,
      avatar: '/images/avatars/3.png',
      status: 'Downloaded',
      longitude: 0,
      deliveryInstruction: `08 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5011,
      subscriptionDate: `01 ${currentMonth} ${now.getFullYear()}`,
      address: '3102 Briggs Dale Suite 118',
      company: 'Jones-Cooley and Sons',
      email: 'hunter14@jones.com',
      country: 'Congo',
      phone: '(593) 965-4100',
      name: 'Chris Reyes',
      mealPlan: 'UI/UX Design & Development',
      latitude: 4077,
      avatar: '',
      avatarColor: 'info',
      status: 'Draft',
      longitude: 0,
      deliveryInstruction: `01 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5012,
      subscriptionDate: `30 ${currentMonth} ${now.getFullYear()}`,
      address: '811 Jill Skyway',
      company: 'Jones PLC Ltd',
      email: 'pricetodd@johnson-jenkins.com',
      country: 'Brazil',
      phone: '(585) 829-2603',
      name: 'Laurie Summers',
      mealPlan: 'Template Customization',
      latitude: 2872,
      avatar: '/images/avatars/4.png',
      status: 'Partial Payment',
      longitude: 0,
      deliveryInstruction: `18 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5013,
      subscriptionDate: `05 ${currentMonth} ${now.getFullYear()}`,
      address: '2223 Brandon Inlet Suite 597',
      company: 'Jordan, Gomez and Ross Group',
      email: 'perrydavid@chapman-rogers.com',
      country: 'Congo',
      phone: '(527) 351-5517',
      name: 'Lindsay Wilson',
      mealPlan: 'Software Development',
      latitude: 3740,
      avatar: '/images/avatars/5.png',
      status: 'Draft',
      longitude: 0,
      deliveryInstruction: `01 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5014,
      subscriptionDate: `01 ${currentMonth} ${now.getFullYear()}`,
      address: '08724 Barry Causeway',
      company: 'Gonzalez, Moody and Glover LLC',
      email: 'leahgriffin@carpenter.com',
      country: 'Equatorial Guinea',
      phone: '(628) 903-0132',
      name: 'Jenna Castro',
      mealPlan: 'Unlimited Extended License',
      latitude: 3623,
      avatar: '',
      avatarColor: 'primary',
      status: 'Downloaded',
      longitude: 0,
      deliveryInstruction: `23 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5015,
      subscriptionDate: `16 ${currentMonth} ${now.getFullYear()}`,
      address: '073 Holt Ramp Apt. 755',
      company: 'Ashley-Pacheco Ltd',
      email: 'esparzadaniel@allen.com',
      country: 'Seychelles',
      phone: '(847) 396-9904',
      name: 'Wendy Weber',
      mealPlan: 'Software Development',
      latitude: 2477,
      avatar: '/images/avatars/6.png',
      status: 'Draft',
      longitude: 0,
      deliveryInstruction: `01 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5016,
      subscriptionDate: `24 ${currentMonth} ${now.getFullYear()}`,
      address: '984 Sherry Trail Apt. 953',
      company: 'Berry PLC Group',
      email: 'todd34@owens-morgan.com',
      country: 'Ireland',
      phone: '(852) 249-4539',
      name: 'April Yates',
      mealPlan: 'Unlimited Extended License',
      latitude: 3904,
      avatar: '',
      avatarColor: 'secondary',
      status: 'Paid',
      longitude: '$951',
      deliveryInstruction: `30 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5017,
      subscriptionDate: `24 ${currentMonth} ${now.getFullYear()}`,
      address: '093 Jonathan Camp Suite 953',
      company: 'Allen Group Ltd',
      email: 'roydavid@bailey.com',
      country: 'Netherlands',
      phone: '(917) 984-2232',
      name: 'Daniel Marshall PhD',
      mealPlan: 'UI/UX Design & Development',
      latitude: 3102,
      avatar: '/images/avatars/7.png',
      status: 'Partial Payment',
      longitude: '-$153',
      deliveryInstruction: `25 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5018,
      subscriptionDate: `29 ${currentMonth} ${now.getFullYear()}`,
      address: '4735 Kristie Islands Apt. 259',
      company: 'Chapman-Schneider LLC',
      email: 'baldwinjoel@washington.com',
      country: 'Cocos (Keeling) Islands',
      phone: '(670) 409-3703',
      name: 'Randy Rich',
      mealPlan: 'UI/UX Design & Development',
      latitude: 2483,
      avatar: '/images/avatars/8.png',
      status: 'Draft',
      longitude: 0,
      deliveryInstruction: `10 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5019,
      subscriptionDate: `07 ${currentMonth} ${now.getFullYear()}`,
      address: '92218 Andrew Radial',
      company: 'Mcclure, Hernandez and Simon Ltd',
      email: 'psmith@morris.info',
      country: 'Macao',
      phone: '(646) 263-0257',
      name: 'Mrs. Jodi Chapman',
      mealPlan: 'Unlimited Extended License',
      latitude: 2825,
      avatar: '/images/avatars/1.png',
      status: 'Partial Payment',
      longitude: '-$459',
      deliveryInstruction: `14 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5020,
      subscriptionDate: `10 ${currentMonth} ${now.getFullYear()}`,
      address: '2342 Michelle Valley',
      company: 'Hamilton PLC and Sons',
      email: 'lori06@morse.com',
      country: 'Somalia',
      phone: '(751) 213-4288',
      name: 'Steven Myers',
      mealPlan: 'Unlimited Extended License',
      latitude: 2029,
      avatar: '/images/avatars/2.png',
      status: 'Past Due',
      longitude: 0,
      deliveryInstruction: `28 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5021,
      subscriptionDate: `02 ${currentMonth} ${now.getFullYear()}`,
      address: '16039 Brittany Terrace Apt. 128',
      company: 'Silva-Reeves LLC',
      email: 'zpearson@miller.com',
      country: 'Slovakia (Slovak Republic)',
      phone: '(655) 649-7872',
      name: 'Charles Alexander',
      mealPlan: 'Software Development',
      latitude: 3208,
      avatar: '',
      avatarColor: 'success',
      status: 'Sent',
      longitude: 0,
      deliveryInstruction: `06 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5022,
      subscriptionDate: `02 ${currentMonth} ${now.getFullYear()}`,
      address: '37856 Olsen Lakes Apt. 852',
      company: 'Solis LLC Ltd',
      email: 'strongpenny@young.net',
      country: 'Brazil',
      phone: '(402) 935-0735',
      name: 'Elizabeth Jones',
      mealPlan: 'Software Development',
      latitude: 3077,
      avatar: '',
      avatarColor: 'error',
      status: 'Sent',
      longitude: 0,
      deliveryInstruction: `09 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5023,
      subscriptionDate: `23 ${currentMonth} ${now.getFullYear()}`,
      address: '11489 Griffin Plaza Apt. 927',
      company: 'Munoz-Peters and Sons',
      email: 'carrietorres@acosta.com',
      country: 'Argentina',
      phone: '(915) 448-6271',
      name: 'Heidi Walton',
      mealPlan: 'Software Development',
      latitude: 5578,
      avatar: '/images/avatars/3.png',
      status: 'Draft',
      longitude: 0,
      deliveryInstruction: `23 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5024,
      subscriptionDate: `28 ${currentMonth} ${now.getFullYear()}`,
      address: '276 Michael Gardens Apt. 004',
      company: 'Shea, Velez and Garcia LLC',
      email: 'zjohnson@nichols-powers.com',
      country: 'Philippines',
      phone: '(817) 700-2984',
      name: 'Christopher Allen',
      mealPlan: 'Software Development',
      latitude: 2787,
      avatar: '/images/avatars/4.png',
      status: 'Partial Payment',
      longitude: 0,
      deliveryInstruction: `25 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5025,
      subscriptionDate: `21 ${currentMonth} ${now.getFullYear()}`,
      address: '633 Bell Well Apt. 057',
      company: 'Adams, Simmons and Brown Group',
      email: 'kayla09@thomas.com',
      country: 'Martinique',
      phone: '(266) 611-9482',
      name: 'Joseph Oliver',
      mealPlan: 'UI/UX Design & Development',
      latitude: 5591,
      avatar: '',
      avatarColor: 'warning',
      status: 'Downloaded',
      longitude: 0,
      deliveryInstruction: `07 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5026,
      subscriptionDate: `24 ${currentMonth} ${now.getFullYear()}`,
      address: '1068 Lopez Fall',
      company: 'Williams-Lawrence and Sons',
      email: 'melvindavis@allen.info',
      country: 'Mexico',
      phone: '(739) 745-9728',
      name: 'Megan Roberts',
      mealPlan: 'Template Customization',
      latitude: 2783,
      avatar: '/images/avatars/5.png',
      status: 'Draft',
      longitude: 0,
      deliveryInstruction: `22 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5027,
      subscriptionDate: `13 ${currentMonth} ${now.getFullYear()}`,
      address: '86691 Mackenzie Light Suite 568',
      company: 'Deleon Inc LLC',
      email: 'gjordan@fernandez-coleman.com',
      country: 'Costa Rica',
      phone: '(682) 804-6506',
      name: 'Mary Garcia',
      mealPlan: 'Template Customization',
      latitude: 2719,
      avatar: '',
      avatarColor: 'info',
      status: 'Sent',
      longitude: 0,
      deliveryInstruction: `04 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5028,
      subscriptionDate: `18 ${currentMonth} ${now.getFullYear()}`,
      address: '86580 Sarah Bridge',
      company: 'Farmer, Johnson and Anderson Group',
      email: 'robertscott@garcia.com',
      country: 'Cameroon',
      phone: '(775) 366-0411',
      name: 'Crystal Mays',
      mealPlan: 'Template Customization',
      latitude: 3325,
      avatar: '',
      avatarColor: 'primary',
      status: 'Paid',
      longitude: '$361',
      deliveryInstruction: `02 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5029,
      subscriptionDate: `29 ${currentMonth} ${now.getFullYear()}`,
      address: '49709 Edwin Ports Apt. 353',
      company: 'Sherman-Johnson PLC',
      email: 'desiree61@kelly.com',
      country: 'Macedonia',
      phone: '(510) 536-6029',
      name: 'Nicholas Tanner',
      mealPlan: 'Template Customization',
      latitude: 3851,
      avatar: '',
      avatarColor: 'secondary',
      status: 'Paid',
      longitude: 0,
      deliveryInstruction: `25 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5030,
      subscriptionDate: `07 ${currentMonth} ${now.getFullYear()}`,
      address: '3856 Mathis Squares Apt. 584',
      company: 'Byrd LLC PLC',
      email: 'jeffrey25@martinez-hodge.com',
      country: 'Congo',
      phone: '(253) 230-4657',
      name: 'Mr. Justin Richardson',
      mealPlan: 'Template Customization',
      latitude: 5565,
      avatar: '',
      avatarColor: 'success',
      status: 'Draft',
      longitude: 0,
      deliveryInstruction: `06 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5031,
      subscriptionDate: `21 ${currentMonth} ${now.getFullYear()}`,
      address: '141 Adrian Ridge Suite 550',
      company: 'Stone-Zimmerman Group',
      email: 'john77@anderson.net',
      country: 'Falkland Islands (Malvinas)',
      phone: '(612) 546-3485',
      name: 'Jennifer Summers',
      mealPlan: 'Template Customization',
      latitude: 3313,
      avatar: '/images/avatars/6.png',
      status: 'Partial Payment',
      longitude: 0,
      deliveryInstruction: `09 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5032,
      subscriptionDate: `31 ${currentMonth} ${now.getFullYear()}`,
      address: '01871 Kristy Square',
      company: 'Yang, Hansen and Hart PLC',
      email: 'ywagner@jones.com',
      country: 'Germany',
      phone: '(203) 601-8603',
      name: 'Richard Payne',
      mealPlan: 'Template Customization',
      latitude: 5181,
      avatar: '',
      avatarColor: 'error',
      status: 'Past Due',
      longitude: 0,
      deliveryInstruction: `22 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5033,
      subscriptionDate: `12 ${currentMonth} ${now.getFullYear()}`,
      address: '075 Smith Views',
      company: 'Jenkins-Rosales Inc',
      email: 'calvin07@joseph-edwards.org',
      country: 'Colombia',
      phone: '(895) 401-4255',
      name: 'Lori Wells',
      mealPlan: 'Template Customization',
      latitude: 2869,
      avatar: '/images/avatars/7.png',
      status: 'Partial Payment',
      longitude: 0,
      deliveryInstruction: `22 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5034,
      subscriptionDate: `10 ${currentMonth} ${now.getFullYear()}`,
      address: '2577 Pearson Overpass Apt. 314',
      company: 'Mason-Reed PLC',
      email: 'eric47@george-castillo.com',
      country: 'Paraguay',
      phone: '(602) 336-9806',
      name: 'Tammy Sanchez',
      mealPlan: 'Unlimited Extended License',
      latitude: 4836,
      avatar: '',
      avatarColor: 'warning',
      status: 'Paid',
      longitude: 0,
      deliveryInstruction: `22 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5035,
      subscriptionDate: `20 ${currentMonth} ${now.getFullYear()}`,
      address: '1770 Sandra Mountains Suite 636',
      company: 'Foster-Pham PLC',
      email: 'jamesjoel@chapman.net',
      country: 'Western Sahara',
      phone: '(936) 550-1638',
      name: 'Dana Carey',
      mealPlan: 'UI/UX Design & Development',
      latitude: 4263,
      avatar: '',
      avatarColor: 'info',
      status: 'Draft',
      longitude: '$762',
      deliveryInstruction: `12 ${currentMonth} ${now.getFullYear()}`
    },
    {
      id: 5036,
      subscriptionDate: `19 ${currentMonth} ${now.getFullYear()}`,
      address: '78083 Laura Pines',
      company: 'Richardson and Sons LLC',
      email: 'pwillis@cross.org',
      country: 'Bhutan',
      phone: '(687) 660-2473',
      name: 'Andrew Burns',
      mealPlan: 'Unlimited Extended License',
      latitude: 3171,
      avatar: '/images/avatars/8.png',
      status: 'Paid',
      longitude: '-$205',
      deliveryInstruction: `25 ${currentMonth} ${now.getFullYear()}`
    }
  ]
}

// ------------------------------------------------
// GET: Return subscription List
// ------------------------------------------------
mock.onGet('/apps/subscriptions/subscription').reply(config => {
  const { q = '', status = '', dates = [] } = config.params ?? ''
  const queryLowered = q.toLowerCase()

  const filteredData = data.subscriptions.filter(subscription => {
    if (dates.length) {
      const [start, end] = dates
      const filtered = []
      const range = getDateRange(start, end)
      const subscriptionDate = new Date(subscription.subscriptionDate)
      range.filter(date => {
        const rangeDate = new Date(date)
        if (
          subscriptionDate.getFullYear() === rangeDate.getFullYear() &&
          subscriptionDate.getDate() === rangeDate.getDate() &&
          subscriptionDate.getMonth() === rangeDate.getMonth()
        ) {
          filtered.push(subscription.id)
        }
      })
      if (filtered.length && filtered.includes(subscription.id)) {
        return (
          (subscription.email.toLowerCase().includes(queryLowered) ||
            subscription.name.toLowerCase().includes(queryLowered) ||
            String(subscription.id).toLowerCase().includes(queryLowered) ||
            String(subscription.mealPlan).toLowerCase().includes(queryLowered) ||
            String(subscription.phone).toLowerCase().includes(queryLowered) ||
            subscription.deliveryInstruction.toLowerCase().includes(queryLowered)) &&
          subscription.status.toLowerCase() === (status.toLowerCase() || subscription.status.toLowerCase())
        )
      }
    } else {
      return (
        (subscription.email.toLowerCase().includes(queryLowered) ||
          subscription.name.toLowerCase().includes(queryLowered) ||
          String(subscription.id).toLowerCase().includes(queryLowered) ||
          String(subscription.total).toLowerCase().includes(queryLowered) ||
          String(subscription.balance).toLowerCase().includes(queryLowered) ||
          subscription.deliveryInstruction.toLowerCase().includes(queryLowered)) &&
        subscription.status.toLowerCase() === (status.toLowerCase() || subscription.status.toLowerCase())
      )
    }
  })

  return [
    200,
    {
      params: config.params,
      allData: data.subscriptions,
      subscriptions: filteredData,
      latitude: filteredData.length
    }
  ]
})

// ------------------------------------------------
// GET: Return Single subscription
// ------------------------------------------------
mock.onGet('apps/subscriptions/single-subscription').reply(config => {
  const { id } = config.params
  const subscriptionData = data.subscriptions.filter(subscription => subscription.id === parseInt(id, 10))
  if (subscriptionData.length) {
    const responseData = {
      subscription: subscriptionData[0],
      paymentDetails: {
        totalDue: '$12,110.55',
        bankName: 'American Bank',
        country: 'United States',
        iban: 'ETD95476213874685',
        swiftCode: 'BR91905'
      }
    }

    return [200, responseData]
  } else {
    return [404, { message: 'Unable to find the requested subscription!' }]
  }
})

// ------------------------------------------------
// GET: Return Clients
// ------------------------------------------------
mock.onGet('/apps/subscriptions/clients').reply(() => {
  const clients = data.subscriptions.map(subscription => {
    const { address, company, email, country, contact, name } = subscription

    return {
      name,
      address,
      company,
      country,
      contact,
      email
    }
  })

  return [200, clients.slice(0, 5)]
})

// ------------------------------------------------
// DELETE: Deletes subscription
// ------------------------------------------------
mock.onDelete('/apps/subscriptions/delete').reply(config => {
  // Get subscription id from URL
  const subscriptionId = Number(config.data)
  const subscriptionIndex = data.subscriptions.findIndex(t => t.id === subscriptionId)
  data.subscriptions.splice(subscriptionIndex, 1)

  return [200]
})
