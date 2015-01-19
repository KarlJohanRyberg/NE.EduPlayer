// Ensure that the NE namespace is avaiable
if (NE === null || NE === undefined) { var NE = {}; } NE.CourseTree = {
    "name": "NE EduPlayer Examples",
    "SCO_name": "NE.EduPlayer_example_course",
    "chapters": [
        {
            "guid": "D86D5675-6624-4C8D-86F1-D4EFF4AA9707",
            "title": "Basic layouts",
            "index": 0,
            "datasrc": "",
            "plugin": "",
            "properties": {
                "displayInMenu": true // false if you want to exclude from main navigation
            },
            "pages": [
                {
                    "guid": "19CEAB46-9E1A-430E-9325-9EBA8D397075",
                    "title": "Introduktion",
                    "datafile": "001_chapter1_page1",
                    "stopprogress": false, // hide this and following pages until navigated to. Defaults to false
                    "keepprogress": true, // forces the player to keep this page out of the visited history. Defaults to true
                    "starthidden": false // hide the pagef on startup even if it has been visited. Defaults to false
                }
            ]
        },
        {
            "guid": "B86D5675-6624-4C8D-86F1-D4EFF4AA9707",
            "title": "CSS classes",
            "index": 1,
            "datasrc": "",
            "plugin": "",
            "properties": {
                "displayInMenu": true // false if you want to exclude from main navigation
            },
            "pages": [
                {
                    "guid": "19CEAB46-9E1A-430E-9325-9EBA8D397075",
                    "title": "Layout &amp; panels",
                    "datafile": "002_chapter2_page1",
                    "stopprogress": false
                },
                {
                    "guid": "19CEBB46-9E1A-430E-9325-9EBA8D397075",
                    "title": "Dividers",
                    "datafile": "003_chapter2_page2",
                    "stopprogress": false
                },
                {
                    "guid": "19CEBB46-9E1A-430E-9325-9EBA8D397075",
                    "title": "Headers &amp; text",
                    "datafile": "004_chapter2_page4",
                    "stopprogress": false
                }
            ]
        },
        {
            "guid": "B86D5675-6624-4C8D-86F1-D4EFF4AA9707",
            "title": "Components",
            "index": 2,
            "datasrc": "",
            "plugin": "",
            "properties": {
                "displayInMenu": true // false if you want to exclude from main navigation
            },
            "pages": [
                {
                    "guid": "19CEAB46-9E1A-430E-9325-9EBA8D397075",
                    "title": "Layout &amp; panels",
                    "datafile": "005_chapter3_page1",
                    "stopprogress": false
                }
            ]
        }
    ]
};


