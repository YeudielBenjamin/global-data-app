'use strict'

const File = require('../models/file')
const Csv = require('csvtojson')

function save(req,res){
	var errors,hasError,csvData,jsonData,rows,fileName

    errors = 'Errores:'
    hasError = false

    var file_path = req.files.data.path;
    var file_split = file_path.split("\\");
    var file_name = file_split[file_split.length - 1];

    csvData = req.files.data.path
    //fileName = req.body.fileName
    fileName = file_name



    console.log("Csvdata:" + csvData);
    console.log("File name:" + fileName);

    //verificamos que tengamos la informacion
    //no uso else if para verificar todos los campos
    if(!csvData){
        hasError = true
        errors += ' data is required,'
    }
    if(!fileName){
        fileName = ''
    }

    //en caso de errores, regresa errors
    if(hasError){
        res.status(400).send(errors)
    }

    rows = []

    //transformamos los datos de csv a json y guardamos los objetos
    Csv()
    .fromFile(csvData)
    .on('data', (data) => {
        jsonData = JSON.parse(data.toString())
        rows.push(jsonData)
    })
    .on('done',(error)=>{
        if(error){
            res.status(500).send('Failed to parse data to json.')
        }else{ 
            //verificamos que el archivo no esté en la base de datos (NO FUNCIONA HASTA AHORITA :´( )
            File.findOne({
                'data':rows
            },(err,file)=>{
                if(err){
                    res.status(500).send('Error in database')
                }
                else if(file){
                    res.status(400).send('The file is registered in the database')
                }
            })

            var file = new File()
            file.name = fileName
            file.data = rows
            file.save((err, file)=>{
                if(err){
                    res.status(500).send('Error in database.')
                }else if(!file){
                    res.status(400).send('Failed to save data.')
                }else{
                    console.log('The file is saved successfully')
                    console.log('id: ' + file._id) 
                    res.status(200).send(file)
                }
           })
        }
    })
}

function consult(req,res){
	var error,hasError,id

    error = 'Errores:'
    hasError = false

    id = req.params.id

    if(!id){
        hasError = true
        error += ' id is required,'
    }

    if(hasError){
        res.status(400).send(error);
    }

    File.findById(id,(err,data)=>{
        if(err){
            res.status(500).send('Error connecting to db')
        }else if(!data){
            res.status(401).send('Could not find data');
        }else{
            res.status(200).send(data);
        }
    });
}

function dataMining(req,res){
    var error,hasError

    error = 'Errores:'
    hasError = false

    if(!req.body.file_id){
        hasError = true
        error += ' id is required,'
    }

    if(hasError){
        res.status(400).send(error);
    }

    File.findById(req.body.file_id,(err,file)=>{
        if(err){
            res.status(500).send('Error connecting to db')
        }else if(!file){
            res.status(401).send('Could not find file');
        }else{
            var years, productions, fruits, percentagesIncreaseTotal, percentagesIncreaseYears, i, j, firstAndLastYears
            var maxYear,maxValue,minYear,minValue
            //primero debemos saber las distintas frutas que hay
            fruits = []
            file.data.forEach((row) => {//iteramos data, contiene la info del archivo y sacamos las frutas que existan
                fruits.push(row.Item)
            })

            if(fruits.length == 0)
                res.status(400).send('Without Items in this file')

            fruits = fruits.unique()// purgamos el array

            //habrá un array de years y productions para cada fruta, osea que son matrices xD
            years = []
            productions = []

            i = 0
            years[i] = []
            productions[i] = []
            var productionsPerYears = []
            maxValue = minValue = parseInt(file.data[0].Value)
            maxYear = minYear = parseInt(file.data[0].Year)

            file.data.forEach((row) => {//iteramos data, contiene la info del archivo y sacamos los años y la produccion por fruta
                if(row.Item == fruits[i]){
                    years[i].push(row.Year)
                    productions[i].push(row.Value)
                }else{
                    years[++i] = [row.Year]
                    productions[i] = [row.Value]
                }
                productionsPerYears.push({year:row.Year,production:row.Value})
                if(maxYear < parseInt(row.Year)){
                    maxYear = parseInt(row.Year)
                }
                if(minYear > parseInt(row.Year)){
                    minYear = parseInt(row.Year)
                }
                if(maxValue < parseInt(row.Value)){
                    maxValue = parseInt(row.Value)
                }
                if(minValue > parseInt(row.Value)){
                    minValue = parseInt(row.Value)
                }
            })

            //verificamos que haya la misma cantidad de años y valores de produccion por fruta
            for (i=0; i<fruits.length; i++) {
                if(years[i].length != productions[i].length)
                    res.status(400).send('ERROR!- FRUIT: ' + fruits[i] + ', years: ' + years[i].length + ', productions: ' + productions[i].length)
            }

            percentagesIncreaseTotal = []
            percentagesIncreaseYears = []

            for ( i = 0; i < fruits.length; i++) {
                percentagesIncreaseYears[i] = []
                //sacamos los procentaje de incremento de un año al otro
                for ( j = 1; j < productions[i].length; j++) {
                    percentagesIncreaseYears[i].push(((productions[i][j] - productions[i][j-1])*100)/productions[i][j-1])
                }
                //guardamos el promedio de incremento de cada fruta, será el que se use para aumentar la produccion despues del año actual
                percentagesIncreaseTotal.push(average(percentagesIncreaseYears[i]))
            }

            
            var valueAux
            firstAndLastYears = []
            for (i = 0; i < fruits.length; i++) {
                firstAndLastYears.push({firstYear:years[i][0],
                                        lastYear:years[i][years[i].length-1]})
                for (valueAux = parseFloat(productions[i][productions[i].length-1]), j = 0; j < req.body.years; j++) {
                    valueAux *= 1 + (parseFloat(percentagesIncreaseTotal[i])/100)
                    productionsPerYears.push({year:(parseFloat(years[i][years[i].length-1])+1+j),production:parseInt(valueAux)})
                    if(maxValue < parseInt(valueAux)){
                        maxValue = parseInt(valueAux)
                    }
                    if(minValue > parseInt(valueAux)){
                        minValue = parseInt(valueAux)
                    }
                }
            }

            maxYear += parseInt(req.body.years)

            res.status(200).send({
                fruits: fruits,
                percentagesIncrease: percentagesIncreaseTotal,
                productions: productionsPerYears,
                years: req.body.years,
                firstAndLastYears:firstAndLastYears,
                country: iso2ToIso3[iso2Countries[file.data[0].Area]],
                unit: file.data[0].Unit,
                maxYear:maxYear,
                minYear:minYear,
                maxValue:maxValue,
                minValue:minValue
            })
        }
    });
}

function average(array){
    var average = 0.0
    array.forEach((data)=>{
        average+=parseFloat(data)
    })
    return average/array.length
}

//agregamos funcion unique a Array, elimina elementos duplicados en un array
Array.prototype.unique=function(a){
    return function(){
        return this.filter(a)
    }
}(function(a,b,c){
    return c.indexOf(a,b+1)<0
})

var iso2Countries = {
        'Afghanistan': 'AF',
        'Aland Islands': 'AX',
        'Albania': 'AL',
        'Algeria': 'DZ',
        'American Samoa': 'AS',
        'Andorra': 'AD',
        'Angola': 'AO',
        'Anguilla': 'AI',
        'Antarctica': 'AQ',
        'Antigua And Barbuda': 'AG',
        'Argentina': 'AR',
        'Armenia': 'AM',
        'Aruba': 'AW',
        'Australia': 'AU',
        'Austria': 'AT',
        'Azerbaijan': 'AZ',
        'Bahamas': 'BS',
        'Bahrain': 'BH',
        'Bangladesh': 'BD',
        'Barbados': 'BB',
        'Belarus': 'BY',
        'Belgium': 'BE',
        'Belize': 'BZ',
        'Benin': 'BJ',
        'Bermuda': 'BM',
        'Bhutan': 'BT',
        'Bolivia': 'BO',
        'Bosnia And Herzegovina': 'BA',
        'Botswana': 'BW',
        'Bouvet Island': 'BV',
        'Brazil': 'BR',
        'British Indian Ocean Territory': 'IO',
        'Brunei Darussalam': 'BN',
        'Bulgaria': 'BG',
        'Burkina Faso': 'BF',
        'Burundi': 'BI',
        'Cambodia': 'KH',
        'Cameroon': 'CM',
        'Canada': 'CA',
        'Cape Verde': 'CV',
        'Cayman Islands': 'KY',
        'Central African Republic': 'CF',
        'Chad': 'TD',
        'Chile': 'CL',
        'China': 'CN',
        'Christmas Island': 'CX',
        'Cocos (Keeling) Islands': 'CC',
        'Colombia': 'CO',
        'Comoros': 'KM',
        'Congo': 'CG',
        'Congo, Democratic Republic': 'CD',
        'Cook Islands': 'CK',
        'Costa Rica': 'CR',
        'Cote D\'Ivoire': 'CI',
        'Croatia': 'HR',
        'Cuba': 'CU',
        'Cyprus': 'CY',
        'Czech Republic': 'CZ',
        'Denmark': 'DK',
        'Djibouti': 'DJ',
        'Dominica': 'DM',
        'Dominican Republic': 'DO',
        'Ecuador': 'EC',
        'Egypt': 'EG',
        'El Salvador': 'SV',
        'Equatorial Guinea': 'GQ',
        'Eritrea': 'ER',
        'Estonia': 'EE',
        'Ethiopia': 'ET',
        'Falkland Islands': 'FK',
        'Faroe Islands': 'FO',
        'Fiji': 'FJ',
        'Finland': 'FI',
        'France': 'FR',
        'French Guiana': 'GF',
        'French Polynesia': 'PF',
        'French Southern Territories': 'TF',
        'Gabon': 'GA',
        'Gambia': 'GM',
        'Georgia': 'GE',
        'Germany': 'DE',
        'Ghana': 'GH',
        'Gibraltar': 'GI',
        'Greece': 'GR',
        'Greenland': 'GL',
        'Grenada': 'GD',
        'Guadeloupe': 'GP',
        'Guam': 'GU',
        'Guatemala': 'GT',
        'Guernsey': 'GG',
        'Guinea': 'GN',
        'Guinea-Bissau': 'GW',
        'Guyana': 'GY',
        'Haiti': 'HT',
        'Heard Island & Mcdonald Islands': 'HM',
        'Holy See (Vatican City State)': 'VA',
        'Honduras': 'HN',
        'Hong Kong': 'HK',
        'Hungary': 'HU',
        'Iceland': 'IS',
        'India': 'IN',
        'Indonesia': 'ID',
        'Iran, Islamic Republic Of': 'IR',
        'Iraq': 'IQ',
        'Ireland': 'IE',
        'Isle Of Man': 'IM',
        'Israel': 'IL',
        'Italy': 'IT',
        'Jamaica': 'JM',
        'Japan': 'JP',
        'Jersey': 'JE',
        'Jordan': 'JO',
        'Kazakhstan': 'KZ',
        'Kenya': 'KE',
        'Kiribati': 'KI',
        'Korea': 'KR',
        'Kuwait': 'KW',
        'Kyrgyzstan': 'KG',
        'Lao People\'s Democratic Republic': 'LA',
        'Latvia': 'LV',
        'Lebanon': 'LB',
        'Lesotho': 'LS',
        'Liberia': 'LR',
        'Libyan Arab Jamahiriya': 'LY',
        'Liechtenstein': 'LI',
        'Lithuania': 'LT',
        'Luxembourg': 'LU',
        'Macao': 'MO',
        'Macedonia': 'MK',
        'Madagascar': 'MG',
        'Malawi': 'MW',
        'Malaysia': 'MY',
        'Maldives': 'MV',
        'Mali': 'ML',
        'Malta': 'MT',
        'Marshall Islands': 'MH',
        'Martinique': 'MQ',
        'Mauritania': 'MR',
        'Mauritius': 'MU',
        'Mayotte': 'YT',
        'Mexico': 'MX',
        'Micronesia, Federated States Of': 'FM',
        'Moldova': 'MD',
        'Monaco': 'MC',
        'Mongolia': 'MN',
        'Montenegro': 'ME',
        'Montserrat': 'MS',
        'Morocco': 'MA',
        'Mozambique': 'MZ',
        'Myanmar': 'MM',
        'Namibia': 'NA',
        'Nauru': 'NR',
        'Nepal': 'NP',
        'Netherlands': 'NL',
        'Netherlands Antilles': 'AN',
        'New Caledonia': 'NC',
        'New Zealand': 'NZ',
        'Nicaragua': 'NI',
        'Niger': 'NE',
        'Nigeria': 'NG',
        'Niue': 'NU',
        'Norfolk Island': 'NF',
        'Northern Mariana Islands': 'MP',
        'Norway': 'NO',
        'Oman': 'OM',
        'Pakistan': 'PK',
        'Palau': 'PW',
        'Palestinian Territory, Occupied': 'PS',
        'Panama': 'PA',
        'Papua New Guinea': 'PG',
        'Paraguay': 'PY',
        'Peru': 'PE',
        'Philippines': 'PH',
        'Pitcairn': 'PN',
        'Poland': 'PL',
        'Portugal': 'PT',
        'Puerto Rico': 'PR',
        'Qatar': 'QA',
        'Reunion': 'RE',
        'Romania': 'RO',
        'Russian Federation': 'RU',
        'Rwanda': 'RW',
        'Saint Barthelemy': 'BL',
        'Saint Helena': 'SH',
        'Saint Kitts And Nevis': 'KN',
        'Saint Lucia': 'LC',
        'Saint Martin': 'MF',
        'Saint Pierre And Miquelon': 'PM',
        'Saint Vincent And Grenadines': 'VC',
        'Samoa': 'WS',
        'San Marino': 'SM',
        'Sao Tome And Principe': 'ST',
        'Saudi Arabia': 'SA',
        'Senegal': 'SN',
        'Serbia': 'RS',
        'Seychelles': 'SC',
        'Sierra Leone': 'SL',
        'Singapore': 'SG',
        'Slovakia': 'SK',
        'Slovenia': 'SI',
        'Solomon Islands': 'SB',
        'Somalia': 'SO',
        'South Africa': 'ZA',
        'South Georgia And Sandwich Isl.': 'GS',
        'Spain': 'ES',
        'Sri Lanka': 'LK',
        'Sudan': 'SD',
        'Suriname': 'SR',
        'Svalbard And Jan Mayen': 'SJ',
        'Swaziland': 'SZ',
        'Sweden': 'SE',
        'Switzerland': 'CH',
        'Syrian Arab Republic': 'SY',
        'Taiwan': 'TW',
        'Tajikistan': 'TJ',
        'Tanzania': 'TZ',
        'Thailand': 'TH',
        'Timor-Leste': 'TL',
        'Togo': 'TG',
        'Tokelau': 'TK',
        'Tonga': 'TO',
        'Trinidad And Tobago': 'TT',
        'Tunisia': 'TN',
        'Turkey': 'TR',
        'Turkmenistan': 'TM',
        'Turks And Caicos Islands': 'TC',
        'Tuvalu': 'TV',
        'Uganda': 'UG',
        'Ukraine': 'UA',
        'United Arab Emirates': 'AE',
        'United Kingdom': 'GB',
        'United States': 'US',
        'United States Outlying Islands': 'UM',
        'Uruguay': 'UY',
        'Uzbekistan': 'UZ',
        'Vanuatu': 'VU',
        'Venezuela': 'VE',
        'Vietnam': 'VN',
        'Virgin Islands, British': 'VG',
        'Virgin Islands, U.S.': 'VI',
        'Wallis And Futuna': 'WF',
        'Western Sahara': 'EH',
        'Yemen': 'YE',
        'Zambia': 'ZM',
        'Zimbabwe': 'ZW'
    }

var iso2ToIso3 = {
    "AF": "AFG",
    "AX": "ALA",
    "AL": "ALB",
    "DZ": "DZA",
    "AS": "ASM",
    "AD": "AND",
    "AO": "AGO",
    "AI": "AIA",
    "AQ": "ATA",
    "AG": "ATG",
    "AR": "ARG",
    "AM": "ARM",
    "AW": "ABW",
    "AU": "AUS",
    "AT": "AUT",
    "AZ": "AZE",
    "BS": "BHS",
    "BH": "BHR",
    "BD": "BGD",
    "BB": "BRB",
    "BY": "BLR",
    "BE": "BEL",
    "BZ": "BLZ",
    "BJ": "BEN",
    "BM": "BMU",
    "BT": "BTN",
    "BO": "BOL",
    "BQ": "BES",
    "BA": "BIH",
    "BW": "BWA",
    "BV": "BVT",
    "BR": "BRA",
    "IO": "IOT",
    "BN": "BRN",
    "BG": "BGR",
    "BF": "BFA",
    "BI": "BDI",
    "CV": "CPV",
    "KH": "KHM",
    "CM": "CMR",
    "CA": "CAN",
    "KY": "CYM",
    "CF": "CAF",
    "TD": "TCD",
    "CL": "CHL",
    "CN": "CHN",
    "CX": "CXR",
    "CC": "CCK",
    "CO": "COL",
    "KM": "COM",
    "CG": "COG",
    "CD": "COD",
    "CK": "COK",
    "CR": "CRI",
    "CI": "CIV",
    "HR": "HRV",
    "CU": "CUB",
    "CW": "CUW",
    "CY": "CYP",
    "CZ": "CZE",
    "DK": "DNK",
    "DJ": "DJI",
    "DM": "DMA",
    "DO": "DOM",
    "EC": "ECU",
    "EG": "EGY",
    "SV": "SLV",
    "GQ": "GNQ",
    "ER": "ERI",
    "EE": "EST",
    "ET": "ETH",
    "FK": "FLK",
    "FO": "FRO",
    "FJ": "FJI",
    "FI": "FIN",
    "FR": "FRA",
    "GF": "GUF",
    "PF": "PYF",
    "TF": "ATF",
    "GA": "GAB",
    "GM": "GMB",
    "GE": "GEO",
    "DE": "DEU",
    "GH": "GHA",
    "GI": "GIB",
    "GR": "GRC",
    "GL": "GRL",
    "GD": "GRD",
    "GP": "GLP",
    "GU": "GUM",
    "GT": "GTM",
    "GG": "GGY",
    "GN": "GIN",
    "GW": "GNB",
    "GY": "GUY",
    "HT": "HTI",
    "HM": "HMD",
    "VA": "VAT",
    "HN": "HND",
    "HK": "HKG",
    "HU": "HUN",
    "IS": "ISL",
    "IN": "IND",
    "ID": "IDN",
    "IR": "IRN",
    "IQ": "IRQ",
    "IE": "IRL",
    "IM": "IMN",
    "IL": "ISR",
    "IT": "ITA",
    "JM": "JAM",
    "JP": "JPN",
    "JE": "JEY",
    "JO": "JOR",
    "KZ": "KAZ",
    "KE": "KEN",
    "KI": "KIR",
    "KP": "PRK",
    "KR": "KOR",
    "KW": "KWT",
    "KG": "KGZ",
    "LA": "LAO",
    "LV": "LVA",
    "LB": "LBN",
    "LS": "LSO",
    "LR": "LBR",
    "LY": "LBY",
    "LI": "LIE",
    "LT": "LTU",
    "LU": "LUX",
    "MO": "MAC",
    "MK": "MKD",
    "MG": "MDG",
    "MW": "MWI",
    "MY": "MYS",
    "MV": "MDV",
    "ML": "MLI",
    "MT": "MLT",
    "MH": "MHL",
    "MQ": "MTQ",
    "MR": "MRT",
    "MU": "MUS",
    "YT": "MYT",
    "MX": "MEX",
    "FM": "FSM",
    "MD": "MDA",
    "MC": "MCO",
    "MN": "MNG",
    "ME": "MNE",
    "MS": "MSR",
    "MA": "MAR",
    "MZ": "MOZ",
    "MM": "MMR",
    "NA": "NAM",
    "NR": "NRU",
    "NP": "NPL",
    "NL": "NLD",
    "NC": "NCL",
    "NZ": "NZL",
    "NI": "NIC",
    "NE": "NER",
    "NG": "NGA",
    "NU": "NIU",
    "NF": "NFK",
    "MP": "MNP",
    "NO": "NOR",
    "OM": "OMN",
    "PK": "PAK",
    "PW": "PLW",
    "PS": "PSE",
    "PA": "PAN",
    "PG": "PNG",
    "PY": "PRY",
    "PE": "PER",
    "PH": "PHL",
    "PN": "PCN",
    "PL": "POL",
    "PT": "PRT",
    "PR": "PRI",
    "QA": "QAT",
    "RE": "REU",
    "RO": "ROU",
    "RU": "RUS",
    "RW": "RWA",
    "BL": "BLM",
    "SH": "SHN",
    "KN": "KNA",
    "LC": "LCA",
    "MF": "MAF",
    "PM": "SPM",
    "VC": "VCT",
    "WS": "WSM",
    "SM": "SMR",
    "ST": "STP",
    "SA": "SAU",
    "SN": "SEN",
    "RS": "SRB",
    "SC": "SYC",
    "SL": "SLE",
    "SG": "SGP",
    "SX": "SXM",
    "SK": "SVK",
    "SI": "SVN",
    "SB": "SLB",
    "SO": "SOM",
    "ZA": "ZAF",
    "GS": "SGS",
    "SS": "SSD",
    "ES": "ESP",
    "LK": "LKA",
    "SD": "SDN",
    "SR": "SUR",
    "SJ": "SJM",
    "SZ": "SWZ",
    "SE": "SWE",
    "CH": "CHE",
    "SY": "SYR",
    "TW": "TWN",
    "TJ": "TJK",
    "TZ": "TZA",
    "TH": "THA",
    "TL": "TLS",
    "TG": "TGO",
    "TK": "TKL",
    "TO": "TON",
    "TT": "TTO",
    "TN": "TUN",
    "TR": "TUR",
    "TM": "TKM",
    "TC": "TCA",
    "TV": "TUV",
    "UG": "UGA",
    "UA": "UKR",
    "AE": "ARE",
    "GB": "GBR",
    "US": "USA",
    "UM": "UMI",
    "UY": "URY",
    "UZ": "UZB",
    "VU": "VUT",
    "VE": "VEN",
    "VN": "VNM",
    "VG": "VGB",
    "VI": "VIR",
    "WF": "WLF",
    "EH": "ESH",
    "YE": "YEM",
    "ZM": "ZMB",
    "ZW": "ZWE"
  }


module.exports = {
	save,
	consult,
    dataMining
}