const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
const pdf = require('html-pdf');


const RESULT_DIR = 'result'
const DATA_DIR = 'data';


function print(whatToPrint) {
    console.log(whatToPrint);
}

function saveFile(fname, data) {
    fs.writeFile(fname, data, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('The file ' + fname + ' was saved!');
    });
}

function showRightAnswers($) {
    $('.correct_qq').addClass('corlated');
    $('.correct_qq').attr('bgcolor', '#1EED82');
    return $;
}

function scrapOtazka($) {
    $ = cheerio.load($('#sright').html(), { decodeEntities: false });
    $('h3').each(function() {
        $(this).replaceWith('<h4>' + $(this).html() + '</h4>');
    });
    $('h2').each(function() {
        $(this).replaceWith('<b>' + $(this).html() + '</b>');
    });
    $('br').each(function() {
        $(this).remove();
    });
    return $;
}

function deleteUnusedTags($) {
    $('.breadcrumb').remove();
    $('.blue_button').remove();
    $('script').remove();
    $('.align-right').remove();

    return $;
}

function createDir(dname) {
    fs.existsSync(dname) || fs.mkdirSync(dname);
}

function proccessDir(dname, absolutDname, dresname) {
    $big = cheerio.load('<html><body></body></html>', { decodeEntities: false });

    // append head to head
    var dataHead = fs.readFileSync(absolutDname + 'head.html');
    $head = cheerio.load(dataHead, { decodeEntities: false });
    console.log($head('body').html());
    //$head = cheerio.load(dataHead, { decodeEntities: false });
    $big('body').append($head('body').html());
    $big('body').append(cheerio.load('<br>'));
    //console.log('');
    //console.log($big.html());

    var files = fs.readdirSync(absolutDname);
    for (var i in files) {
        console.log('Proccessing file: ' + files[i] + ', idx: ' + i);
        if (files[i] == 'head.html') { continue; }

        var data = fs.readFileSync(absolutDname + i /*files[i]*/ );

        $ = cheerio.load(data, { decodeEntities: false });
        $ = showRightAnswers($);
        $ = scrapOtazka($);
        $ = deleteUnusedTags($);

        $big('body').append($.html());
        $big('body').append('<br>');

        //console.log($.html());
        //console.log($big.html());
        //saveFile('./batch 1 scrapped/' + files[i] + '.html', $.html());
    }

    //saveFile('./batch 1 scrapped/all-' + absolutDname + '.html', $big.html());

    createDir(RESULT_DIR)

    var finalName = dresname + 'all-' + dname;

    saveFile(finalName + '.html', $big.html());

    /*
    var config = {
        'format': 'A4',
        'timeout': 1000000,
        'html': { 'zoom': 0.55 }
    };
    pdf.create($big.html(), config).toFile(finalName + '.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res);
    });
    */
}

var source = __dirname + '/' + DATA_DIR + '/';
var result = __dirname + '/' + RESULT_DIR + '/';

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source =>
    fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

createDir(result);

for (var dname in getDirectories(source)) {
    var absolutDname = source + dname + '/';
    console.log(absolutDname);
    proccessDir(dname, absolutDname, result);
}