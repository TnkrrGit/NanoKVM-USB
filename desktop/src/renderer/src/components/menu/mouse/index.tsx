import { ReactElement, useEffect, useState } from 'react'
import { Popover } from 'antd'
import { useAtom, useSetAtom } from 'jotai'
import { MouseIcon } from 'lucide-react'

import { mouseModeAtom, mouseStyleAtom, scrollDirectionAtom } from '@renderer/jotai/mouse'
import * as storage from '@renderer/libs/storage'

import { Direction } from './direction'
import { Mode } from './mode'
import { Style } from './style'

export const Mouse = (): ReactElement => {
  const [mouseStyle, setMouseStyle] = useAtom(mouseStyleAtom)
  const setMouseMode = useSetAtom(mouseModeAtom)
  const setScrollDirection = useSetAtom(scrollDirectionAtom)

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  useEffect(() => {
    const style = storage.getMouseStyle()
    if (style && style !== mouseStyle) {
      setMouseStyle(style)
    }

    const mode = storage.getMouseMode()
    if (mode) {
      setMouseMode(mode)
    }

    const direction = storage.getMouseScrollDirection()
    if (direction && Number(direction)) {
      setScrollDirection(Number(direction))
    }
  }, [])

  const content = (
    <div className="flex flex-col space-y-1">
      <Style />
      <Mode />
      <Direction />
    </div>
  )

  return (
    <Popover
      content={content}
      placement="bottomLeft"
      trigger="click"
      arrow={false}
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
    >
      <div className="flex h-[28px] cursor-pointer items-center justify-center rounded px-2 text-white hover:bg-neutral-700/70">
        <MouseIcon size={18} />
      </div>
    </Popover>
  )
}
