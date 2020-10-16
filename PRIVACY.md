## PRIVACY

Eklentinin çalışabilmesi için twitter oturumunuzla ilgili bazı hassas bilgilere ihtiyaç var.

Hangi iznin neden istendiğini açıklayayım:

 - ### webRequest

Bu izin sayesinde twitterdaki oturum bilgilerinizi bir değişkende saklıyorum. Bu bilgiler sayesinde Twitter API adreslerine istek atıp videoyu indirebilmeniz sağlanacak. Örneğin bir videoyu indirmek istendiğinizde ``https://twitter.com/i/api/2/timeline/conversation/[id].json`` adresine istek atıp videonun indirilebilir urlini öğrenmek gerekiyor. Fakat bu adrese istek atabilmek için ``x-guest-token`` ya da ``x-csrf-token`` ve ``authorization`` üst bilgisine ihtiyaç var. ``webRequest`` izni sayesinde tweetlerin yüklenmesi için yapılan isteklerin üst bilgisine erişip bunlardan gerekli bilgileri bir değişkende tutuyorum. Bu hassas bilgi saklanmıyor ya da tarayıcıdan dışarıya çıkmıyor.

 - ### host

Twitter API adreslerine istek atabilmek ve yapılan istekleri görmek için bu izne ihtiyaç var. ``twitter.com/i/api/2/timeline`` adresine yapılan "xmlhttprequest" isteklerin üst bilgilerini görüyor ve ``twitter.com/i/api/2/timeline/conversation/[id].json`` adresine videonun bilgilerini almak için istek atıyor.

İlgili kod bloğunu görmek için [tıklayın.](https://github.com/mstfsnc/twitter-video-downloader/blob/master/src/background/api.js#L4-L23)
