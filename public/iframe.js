(() => {
  const targetNode = document.querySelector('#editor')

  const config = { childList: true, subtree: true }

  const observer = new MutationObserver((mutationsList) => {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
              if (node.classList && node.classList.contains('panel-v') && node.classList.contains('right')) {
                observer.disconnect()
                const iframe = node.querySelector('iframe')
                const id = window.location.pathname.slice(1)
                iframe.src = '/jshell/' + id
              }
            }
        }
    }
  })
  observer.observe(targetNode, config)
})()
