// Custom Scripts

// project data retrieved from the json file
var data

// all the applications-datasets tags
var app_tags

// all the techniques tags
var tec_tags

// all the worktypes tags
var type_tags = ['Project', 'Thesis', 'Internship']

// the selected applications-datasets filters
var app_filters = []

// the selected techniques filters
var tec_filters = []

// the selected worktypes filters
var type_filters = []

// whether or not the project cards are expanded
var expanded = false

var id = "1VP65rJp_DxbNVjN_fIBjIU7rAgziJrno_FBAPz4JCHo"
// the google sheets file id

var gid = "471452889"
// the google sheets worksheet id

var format = "tsv"
// the google sheets export format

$(() => {
    $.ajax({
        type: "GET",
        url: "https://docs.google.com/spreadsheets/d/" + id + "/export?format=" + format + "&id=" + id + "&gid=" + gid,
        dataType: "text",
        success: text => {
            // manually retrieves information from tsv file and assigns the "data" global variable
            const lines = text.split('\r\n');
            const columns = lines[0].split('\t');
            data = lines.slice(1).map((line, index) => {
                // we use tsv instead of csv due to commas being used to separate tags within columns
                info = line.split('\t')
                // checks that the info array matches the columns array
                console.assert(info.length === columns.length, 'Project ' + index + ' is bad-shaped.')
                // create output dictionary by matching columns and values
                dictionary = {}
                for (i = 0; i < columns.length; i++) {
                    dictionary[columns[i]] = info[i]
                }
                return dictionary
            })

            // filters out unavailable projects
            data = data.filter(project => project['Available'] == 'TRUE').map(project => {
                // splits tags by comma and capitalizes them
                project['Applications-Datasets'] = project['Applications-Datasets'].split(', ').map(capitalize)
                project['Techniques'] = project['Techniques'].split(', ').map(capitalize)
                // convert worktype tags to boolean values
                project['Thesis'] = project['Thesis'] == 'TRUE'
                project['Project'] = project['Project'] == 'TRUE'
                project['Internship'] = project['Internship'] == 'TRUE'
                return project
            })

            // retrieves the tags by flattening the list of tags then it gets unique values by creating a temporary set
            app_tags = [... new Set(data.flatMap(project => project['Applications-Datasets']))].sort()
            tec_tags = [... new Set(data.flatMap(project => project['Techniques']))].sort()

            // renders the page
            $('#filters').html(filters(app_tags, tec_tags, type_tags))
            $('#projects').html(projects(data))
            filterProjects()
        }
     })
})

// Show/hide the projects list depending on the filters
function filterProjects() {
    emptyList = data.map(project => {
        // data passes the filter if all the three conditions are satisfied
        // i.e., either there are no filters or at least one tag is included
        const app_condition = app_filters.length == 0 || app_filters.some(tag => project['Applications-Datasets'].includes(tag))
        const tec_condition = tec_filters.length == 0 || tec_filters.some(tag => project['Techniques'].includes(tag))
        const type_condition = type_filters.length == 0 || type_filters.filter(tag => project[tag]).length > 0
        return app_condition && tec_condition && type_condition
    }).map((show, index) => {
        // at this point, depending on the boolean value, the <div> is retrieved via id and shown or hidden, respectively
        if (show) {
            $('#project-' + index).show()
        } else {
            $('#project-' + index).hide()
        }
        return show
    }).filter(show => show).length == 0
    // if the list is empty, shows the warning <div>, otherwise it hides that
    if (emptyList) {
        $('#warning').show()
    } else {
        $('#warning').hide()
    }
}

// Accordion function: either expands or collapses all the project cards

function toggle_button() {
    if (expanded) {
        $('.collapse').collapse('hide')
        $('#toggle').text('Expand')
        expanded = false
    } else {
        $('.collapse').collapse('show')
        $('#toggle').text('Collapse')
        expanded = true
    }
}

// Filtering functions: checks whether the checkbox has been activated or deactivated,
// then, it either pushes the element (caller) in the filtering list or deletes it and renders the projects again

function applications(caller) {
    console.log()
    if ($('#applications-' + caller.replace(' ', '-'))[0].checked) {
        app_filters.push(caller)
    } else {
        app_filters = app_filters.filter(tag => tag != caller)
    }
    filterProjects()
}

function techniques(caller) {
    if ($('#techniques-' + caller.replace(' ', '-'))[0].checked) {
        tec_filters.push(caller)
    } else {
        tec_filters = tec_filters.filter(tag => tag != caller)
    }
    filterProjects()
}

function worktypes(caller) {
    if ($('#worktypes-' + caller.replace(' ', '-'))[0].checked) {
        type_filters.push(caller)
    } else {
        type_filters = type_filters.filter(tag => tag != caller)
    }
    filterProjects()
}

// Util functions
function capitalize(string) {
    return string.trim().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
}