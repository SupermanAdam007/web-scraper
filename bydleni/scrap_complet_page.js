const fs = require('fs');
const cheerio = require('cheerio');
const wget = require('node-wget');


const DATA_DIR = 'data';


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
    $('a').each(
        function(j, elema) {
            wget({
                url: baseurl + $(elema).attr('href'),
                dest: newDirName + '/' + j //$(elema).text().split('.')[0]
            });
            //console.log($(elema).attr('href'));
            //console.log($(elema).text());
            console.log(newDirName + '/' + j /*$(elema).text().split('.')[0]*/ );
        }
    );
}

var data = fs.readFileSync(complete);

$ = cheerio.load(data, { decodeEntities: false });
$ = cheerio.load($('#saccord').html(), { decodeEntities: false });

createDir(DATA_DIR)

var iter = 0;
$('body').children().each(
    function(i, elem) {
        var h3fname = __dirname + '/' + DATA_DIR + '/batch_head_' + iter + '.html';
        var divfname = __dirname + '/' + DATA_DIR + '/batch_data_' + iter + '.html';
        var newDirName = __dirname + '/' + DATA_DIR + '/' + iter;

        if (elem.name == "h3") {
            saveFile(h3fname, $(elem).html());
            createDir(newDirName);
            saveFile(newDirName + '/head.html', $(elem).html());
        }
        if (elem.name == "div") {
            //fs.createReadStream('test.log').pipe(fs.createWriteStream('newLog.log'));

            saveFile(
                divfname, $(elem).html()
            );

            $ = cheerio.load($(elem).html(), { decodeEntities: false });

            downQuestionsToDir($, newDirName);

            iter++;
        }
    }
);