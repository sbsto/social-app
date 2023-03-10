import React from 'react'
import {observer} from 'mobx-react-lite'
import {StatusBar, StyleSheet, useWindowDimensions, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useStores} from 'state/index'
import {Login} from 'view/screens/Login'
import {ModalsContainer} from 'view/com/modals/Modal'
import {Lightbox} from 'view/com/lightbox/Lightbox'
import {Text} from 'view/com/util/text/Text'
import {ErrorBoundary} from 'view/com/util/ErrorBoundary'
import {Composer} from './Composer'
import {s} from 'lib/styles'
import {useTheme} from 'lib/ThemeContext'
import {usePalette} from 'lib/hooks/usePalette'
import {RoutesContainer, TabsNavigator} from '../../Routes'

export const Shell: React.FC = observer(() => {
  const theme = useTheme()
  const pal = usePalette('default')
  const store = useStores()
  const winDim = useWindowDimensions()
  const safeAreaInsets = useSafeAreaInsets()
  const containerPadding = React.useMemo(
    () => ({height: '100%', paddingTop: safeAreaInsets.top}),
    [safeAreaInsets],
  )

  if (store.hackUpgradeNeeded) {
    return (
      <View style={styles.outerContainer}>
        <View style={[s.flexCol, s.p20, s.h100pct]}>
          <View style={s.flex1} />
          <View>
            <Text type="title-2xl" style={s.pb10}>
              Update required
            </Text>
            <Text style={[s.pb20, s.bold]}>
              Please update your app to the latest version. If no update is
              available yet, please check the App Store in a day or so.
            </Text>
            <Text type="title" style={s.pb10}>
              What's happening?
            </Text>
            <Text style={s.pb10}>
              We're in the final stages of the AT Protocol's v1 development. To
              make sure everything works as well as possible, we're making final
              breaking changes to the APIs.
            </Text>
            <Text>
              If we didn't botch this process, a new version of the app should
              be available now.
            </Text>
          </View>
          <View style={s.flex1} />
          <View style={s.footerSpacer} />
        </View>
      </View>
    )
  }

  if (!store.session.hasSession) {
    return (
      <View style={styles.outerContainer}>
        <StatusBar
          barStyle={
            theme.colorScheme === 'dark' ? 'light-content' : 'dark-content'
          }
        />
        <Login />
        <ModalsContainer />
      </View>
    )
  }

  return (
    <View testID="mobileShellView" style={[styles.outerContainer, pal.view]}>
      <StatusBar
        barStyle={
          theme.colorScheme === 'dark' ? 'light-content' : 'dark-content'
        }
      />
      <RoutesContainer>
        <View style={containerPadding}>
          <ErrorBoundary>
            <TabsNavigator />
          </ErrorBoundary>
        </View>
        <ModalsContainer />
        <Lightbox />
        <Composer
          active={store.shell.isComposerActive}
          onClose={() => store.shell.closeComposer()}
          winHeight={winDim.height}
          replyTo={store.shell.composerOpts?.replyTo}
          imagesOpen={store.shell.composerOpts?.imagesOpen}
          onPost={store.shell.composerOpts?.onPost}
          quote={store.shell.composerOpts?.quote}
        />
      </RoutesContainer>
    </View>
  )
})

const styles = StyleSheet.create({
  outerContainer: {
    height: '100%',
  },
})
