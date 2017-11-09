export default function(request, response) {

    return response.send({
        title: `An example page title for ${request.params.slug}.`
    });

}
