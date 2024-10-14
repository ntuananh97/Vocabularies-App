import { Drawer, DrawerProps, Grid } from 'antd'
import React, { useCallback, useMemo } from 'react'

interface CustomAntdDrawerProps extends DrawerProps {
  children: React.ReactNode
}

const { useBreakpoint } = Grid;


const CustomAntdDrawer: React.FC<CustomAntdDrawerProps> = ({children, ...props}) => {
  const {lg: lgBreakpoint} = useBreakpoint();

  const defaultDrawerProps = useMemo(() => {
    const defaultProps: DrawerProps = {
      width: '80%', // responsive in mobile, tablet
    }

    if (lgBreakpoint) delete defaultProps.width

    return defaultProps
  }, [lgBreakpoint])


  return (
    <Drawer {...props} {...defaultDrawerProps}>{children}</Drawer>
  )
}

export default CustomAntdDrawer
