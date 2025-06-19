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
  
  // 直接使用字符串形式的botId，不包含引号
  const rawBotId = siteConfig('COZE_BOT_ID')
  // 确保botId是纯数字字符串，移除可能的引号
  const botId = typeof rawBotId === 'string' ? rawBotId.replace(/['"]/g, '') : '7517345767523549218'
  const token = siteConfig('COZE_PAT_TOKEN')

  // 调试信息
  console.log('Coze调试信息:')
  console.log('原始botId:', rawBotId, '类型:', typeof rawBotId)
  console.log('处理后botId:', botId, '类型:', typeof botId)
  console.log('botId长度:', botId.length)
  console.log('token是否存在:', !!token)

  const loadCoze = async () => {
    await loadExternalResource(cozeSrc)
    const CozeWebSDK = window?.CozeWebSDK
    if (CozeWebSDK) {
      // 打印配置对象
      const config = {
        config: {
          type: 'bot',
          bot_id: botId, // 纯数字字符串，不包含引号
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
      console.log('配置中的bot_id:', config.config.bot_id, '类型:', typeof config.config.bot_id)
      
      const cozeClient = new CozeWebSDK.WebChatClient(config)
      console.log('coze', cozeClient)
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
