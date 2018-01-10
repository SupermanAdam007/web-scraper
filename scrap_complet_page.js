const fs = require('fs');
const cheerio = require('cheerio');
const wget = require('node-wget');

complete = __dirname + '/complet.html';
baseurl = 'http://www.eurocert.cz';

function saveFile(fname, data) {
    fs.writeFile(fname, data, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('The file ' + fname + ' was saved!');
    });
}

function createDir(dname) {
    fs.existsSync(dname) || fs.mkdirSync(dname);
}

function downQuestionsToDir($, newDirName) {
    createDir(newDirName);
    $('a').each(
        function(j, elema) {
            wget({
                url: baseurl + $(elema).attr('href'),
                dest: newDirName + '/' + $(elema).text().split('.')[0]
            });
            console.log($(elema).attr('href'));
            console.log($(elema).text());
        }
    );
}

var data = fs.readFileSync(complete);

$ = cheerio.load(data, { decodeEntities: false });
$ = cheerio.load($('#saccord').html(), { decodeEntities: false });

var iter = 0;
$('body').children().each(
    function(i, elem) {
        if (elem.name == "h3") {
            saveFile(
                __dirname + '/data/batch_head_' + iter + '.html', $(elem).html()
            );
        }
        if (elem.name == "div") {
            saveFile(
                __dirname + '/data/batch_data_' + iter + '.html', $(elem).html()
            );

            $ = cheerio.load($(elem).html(), { decodeEntities: false });

            downQuestionsToDir($, __dirname + '/data/' + iter);

            iter++;
        }
    }
);