const fs = require('fs');
const cheerio = require('cheerio');

const testFolder = './otazky_html/';

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
    return $;
}

function deleteUnusedTags($) {
    $('.breadcrumb').remove();
    $('.blue_button').remove();
    $('script').remove();
    $('.align-right').remove();

    return $;
}

function proccessDir(dname) {
    $big = cheerio.load('<html><body></body></html>', { decodeEntities: false });

    var files = fs.readdirSync(dname);
    for (var i in files) {
        var data = fs.readFileSync(dname + files[i]);

        $ = cheerio.load(data, { decodeEntities: false });
        $ = showRightAnswers($);
        $ = scrapOtazka($);
        $ = deleteUnusedTags($);

        $big('body').append($.html());
        console.log($.html());
        console.log($big.html());
        saveFile('./batch 1 scrapped/' + files[i] + '.html', $.html());
    }
    saveFile('./batch 1 scrapped/all.html', $big.html());
}

//proccessDir(__dirname + '/batch 1/');
proccessDir(__dirname + '/data/0/');