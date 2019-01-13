var writer = csvWriter()
writer.pipe(fs.createWriteStream('out.csv'))
writer.write({hello: "world", foo: "bar", baz: "taco"})
writer.end()

/*var fs = require('fs');
var json2csv = require('json2csv');
var newLine= "\r\n";

var fields = ['Total', 'Name'];

var appendThis = [
    {
        'Total': '100',
        'Name': 'myName1'
    },
    {
        'Total': '200',
        'Name': 'myName2'
    }
];

var toCsv = {
    data: appendThis,
    fields: fields,
    hasCSVColumnTitle: false
};

fs.stat('file.csv', function (err, stat) {
  console.log("testing");
    if (err == null) {
        console.log('File exists');

        //write the actual data and end with newline
        var csv = json2csv(toCsv) + newLine;

        fs.appendFile('file.csv', csv, function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });
    }
    else {
        //write the headers and newline
        console.log('New file, just writing headers');
        fields= (fields + newLine);

        fs.writeFile('file.csv', fields, function (err, stat) {
            if (err) throw err;
            console.log('file saved');
        });
    }
});

*/
