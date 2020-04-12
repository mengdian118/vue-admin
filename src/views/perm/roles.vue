<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" size="small ">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter' ]">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag class="role-tag" closable size="medium" @close="removePermById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right" />
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <!-- 利用for 循环 渲染二级权限 -->
                <el-row v-for="(item2, index2) in item1.children" :key="item2.id" :class="[index2 === 0 ? '': 'bdtop', 'vcenter' ]">
                  <el-col :span="6">
                    <el-tag class="role-tag" type="success" closable size="medium" @close="removePermById(scope.row,item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right" />
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3) in item2.children" :key="item3.id" class="role-tag" type="warning" closable size="medium" @close="removePermById(scope.row,item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="80px" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleDesc" label="角色描述" />
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 控制分配权限对话框
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定
      treeProps: {
        label: 'authName',
        children: 'children'

      },
      // 默认选中节点id值的数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''

    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
      //    console.log(this.rolesList)
    },
    async removePermById(role, permId) {
      // 弹框提示用户是否删除
      const ConfirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch(error => error)
      if (ConfirmResult !== 'confirm') return this.$message.info('您已取消删除')

      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${permId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      role.children = res.data
      this.$message.success(res.meta.msg)
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    /**
     * 通过递归的形式 获取角色下的所有三级权限的id
     * 并保存到defKeys中
     */
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含 children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item =>
        this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击确定为角色分配权限
    async allRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
    }

  }
}

</script>
<style lang="scss" scoped>
.role-tag{margin:8px;}
.bdtop{border-top:1px solid #eee;}
.bdbottom{border-bottom:1px solid #eee;}
.vcenter{display:flex;align-items:center;}
</style>
