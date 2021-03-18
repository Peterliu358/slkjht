<template>
  <div class="app">
    <el-container class="el-container">
      <el-header class="header">
        <p class="Suolu">Suolu</p>
        <p class="back">退出登录</p>
        <p class="user">藕紫</p>
        <el-avatar
          :src="require('@/assets/img/Peterliu.jpg')"
          class="photo"
          :size="30"
        ></el-avatar>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
          <el-menu
            :uniqueOpened="true"
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#23262e"
            text-color="#FFFFFFB3"
            active-text-color="#ffd04b"
            :router="true"
          >
            <el-menu-item index="/" class="column-li">
              <i class="el-icon-date"></i>
              <template #title>栏目管理</template>
            </el-menu-item>
            <el-menu-item class="column-li" index="/special">
              <i class="el-icon-menu"></i>
              <template #title>专题管理</template>
            </el-menu-item>
            <el-menu-item class="column-li" index="/smallvideo">
              <i class="el-icon-data-board"></i>
              <template #title>小视频管理</template>
            </el-menu-item>
            <el-menu-item class="column-li" index="/release">
              <i class="el-icon-s-promotion"></i>
              <template #title>视频发布</template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer class="footer">Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<style scoped src="@/assets/css/app.scss" lang="scss">
</style>
