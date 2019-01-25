In this directory

mvn install 

docker build . -t ccri-documentviewer

docker tag ccri-documentviewer thorlogic/ccri-documentviewer

docker push thorlogic/ccri-documentviewer


docker run -d -p 8186:8184 ccri-ccri-fhirserver

