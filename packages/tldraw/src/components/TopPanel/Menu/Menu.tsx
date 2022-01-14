import * as React from 'react'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useTldrawApp } from '~hooks'
import { PreferencesMenu } from '../PreferencesMenu'
import {
  DMItem,
  DMContent,
  DMDivider,
  DMSubMenu,
  DMTriggerIcon,
} from '~components/Primitives/DropdownMenu'
import { useFileSystemHandlers } from '~hooks'
import { preventEvent } from '~components/preventEvent'
import { TDExportTypes, TDSnapshot } from '~types'
import { Divider } from '~components/Primitives/Divider'

interface MenuProps {
  readOnly: boolean
}

const numberOfSelectedIdsSelector = (s: TDSnapshot) => {
  return s.document.pageStates[s.appState.currentPageId].selectedIds.length
}

const disableAssetsSelector = (s: TDSnapshot) => {
  return s.appState.disableAssets
}

export const Menu = React.memo(function Menu({ readOnly }: MenuProps) {
  const app = useTldrawApp()

  const numberOfSelectedIds = app.useStore(numberOfSelectedIdsSelector)

  const disableAssets = app.useStore(disableAssetsSelector)

  const [_, setForce] = React.useState(0)

  React.useEffect(() => setForce(1), [])

  const { onNewProject, onOpenProject, onSaveProject, onSaveProjectAs } = useFileSystemHandlers()

  const handleExportPNG = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.PNG)
  }, [app])

  const handleExportJPG = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.JPG)
  }, [app])

  const handleExportWEBP = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.WEBP)
  }, [app])

  const handleExportPDF = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.PDF)
  }, [app])

  const handleExportSVG = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.SVG)
  }, [app])

  const handleExportJSON = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.JSON)
  }, [app])

  const handleSignIn = React.useCallback(() => {
    app.callbacks.onSignIn?.(app)
  }, [app])

  const handleSignOut = React.useCallback(() => {
    app.callbacks.onSignOut?.(app)
  }, [app])

  const handleCut = React.useCallback(() => {
    app.cut()
  }, [app])

  const handleCopy = React.useCallback(() => {
    app.copy()
  }, [app])

  const handlePaste = React.useCallback(() => {
    app.paste()
  }, [app])

  const handleCopySvg = React.useCallback(() => {
    app.copySvg()
  }, [app])

  const handleCopyJson = React.useCallback(() => {
    app.copyJson()
  }, [app])

  const handleSelectAll = React.useCallback(() => {
    app.selectAll()
  }, [app])

  const handleSelectNone = React.useCallback(() => {
    app.selectNone()
  }, [app])

  const handleUploadMedia = React.useCallback(() => {
    app.openAsset()
  }, [app])

  const showFileMenu =
    app.callbacks.onNewProject ||
    app.callbacks.onOpenProject ||
    app.callbacks.onSaveProject ||
    app.callbacks.onSaveProjectAs ||
    !disableAssets ||
    app.callbacks.onExport


  const hasSelection = numberOfSelectedIds > 0

  return (
    <DropdownMenu.Root dir="ltr">
      <DMTriggerIcon>
        <HamburgerMenuIcon />
      </DMTriggerIcon>
      <DMContent variant="menu">
        {showFileMenu && (
          <DMSubMenu label="File...">
            {app.callbacks.onSaveProject && (
              <DMItem onClick={onSaveProject} kbd="#S">
                Save
              </DMItem>
            )}
            {app.callbacks.onSaveProjectAs && (
              <DMItem onClick={onSaveProjectAs} kbd="#⇧S">
                Save As...
              </DMItem>
            )}
            {app.callbacks.onExport && (
              <>
                <Divider />
                <DMSubMenu label="Export" size="small">
                  <DMItem onClick={handleExportPNG}>PNG</DMItem>
                  <DMItem onClick={handleExportJPG}>JPG</DMItem>
                  <DMItem onClick={handleExportWEBP}>WEBP</DMItem>
                  <DMItem onClick={handleExportSVG}>SVG</DMItem>
                  <DMItem onClick={handleExportJSON}>JSON</DMItem>
                </DMSubMenu>
              </>
            )}
            {!disableAssets && (
              <>
                <Divider />
                <DMItem onClick={handleUploadMedia} kbd="#U">
                  Upload Media
                </DMItem>
              </>
            )}
          </DMSubMenu>
        )}
        {!readOnly && (
          <>
            <DMSubMenu label="Edit...">
              <DMItem onSelect={preventEvent} onClick={app.undo} kbd="#Z">
                Undo
              </DMItem>
              <DMItem onSelect={preventEvent} onClick={app.redo} kbd="#⇧Z">
                Redo
              </DMItem>
              <DMDivider dir="ltr" />
              <DMItem onSelect={preventEvent} disabled={!hasSelection} onClick={handleCut} kbd="#X">
                Cut
              </DMItem>
              <DMItem
                onSelect={preventEvent}
                disabled={!hasSelection}
                onClick={handleCopy}
                kbd="#C"
              >
                Copy
              </DMItem>
              <DMItem onSelect={preventEvent} onClick={handlePaste} kbd="#V">
                Paste
              </DMItem>
              <DMDivider dir="ltr" />
              <DMItem
                onSelect={preventEvent}
                disabled={!hasSelection}
                onClick={handleCopySvg}
                kbd="#⇧C"
              >
                Copy as SVG
              </DMItem>
              <DMItem onSelect={preventEvent} disabled={!hasSelection} onClick={handleCopyJson}>
                Copy as JSON
              </DMItem>
              <DMDivider dir="ltr" />
              <DMItem onSelect={preventEvent} onClick={handleSelectAll} kbd="#A">
                Select All
              </DMItem>
              <DMItem onSelect={preventEvent} onClick={handleSelectNone}>
                Select None
              </DMItem>
            </DMSubMenu>
          </>
        )}
        <DMDivider dir="ltr" />
        <PreferencesMenu />
      </DMContent>
    </DropdownMenu.Root>
  )
})
