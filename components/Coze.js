import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * Coze-AI机器人
 * @returns
 */
export default function Coze() {
  const cozeSrc = siteConfig(
    'COZE_SRC_URL',
    'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/0.1.0-beta.6/libs/cn/index.js'
  )
  const title = siteConfig('COZE_TITLE', 'NotionNext助手')
  const botId = String(siteConfig('COZE_BOT_ID') || '')
  const token = String(siteConfig('COZE_PAT_TOKEN') || '')

  console.log('Coze配置信息:', { 
    cozeSrc, 
    title, 
    botId: typeof botId === 'string' ? botId : '非字符串类型', 
    tokenExists: !!token 
  })

  const loadCoze = async () => {
    try {
      await loadExternalResource(cozeSrc)
      const CozeWebSDK = window?.CozeWebSDK
      
      if (!CozeWebSDK) {
        console.error('CozeWebSDK未加载成功')
        return
      }
      
      console.log('CozeWebSDK加载成功')
      
      if (!botId) {
        console.error('缺少bot_id配置')
        return
      }
      
      if (!token) {
        console.error('缺少token配置')
        return
      }

      const config = {
        config: {
          type: 'bot',
          bot_id: botId,
          isIframe: false,
        },
        auth: {
          type: 'token',
          token: token,
          onRefreshToken: async () => token
        },
        userInfo: {
          id: 'user',
          url: siteConfig('COZE_USER_AVATAR', 'https://lf-coze-web-cdn.coze.cn/obj/eden-cn/lm-lgvj/ljhwZthlaukjlkulzlp/coze/coze-logo.png'),
          nickname: siteConfig('COZE_USER_NICKNAME', 'User'),
        },
        ui: {
          base: {
            icon: siteConfig('COZE_ICON', 'https://lf-coze-web-cdn.coze.cn/obj/eden-cn/lm-lgvj/ljhwZthlaukjlkulzlp/coze/chatsdk-logo.png'),
            layout: 'pc',
            lang: siteConfig('COZE_LANG', 'zh-CN'),
            zIndex: 1000
          },
          header: {
            isShow: true,
            isNeedClose: true,
          },
          asstBtn: {
            isNeed: true
          },
          footer: {
            isShow: true,
            expressionText: siteConfig('COZE_FOOTER_TEXT', 'Powered by NotionNext'),
          },
          chatBot: {
            title: title,
            uploadable: true,
            width: 390,
          },
        }
      }
      
      console.log('Coze初始化配置:', JSON.stringify(config))
      
      try {
        const cozeClient = new CozeWebSDK.WebChatClient(config)
        console.log('cozeClient初始化成功:', cozeClient)
      } catch (error) {
        console.error('初始化CozeWebSDK.WebChatClient时出错:', error)
      }
    } catch (error) {
      console.error('加载Coze脚本时出错:', error)
    }
  }

  useEffect(() => {
    if (!botId || !token) {
      console.warn('缺少必要的Coze配置参数，botId或token不存在')
      return
    }
    loadCoze()
  }, [])
  return <></>
}
