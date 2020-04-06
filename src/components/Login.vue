<template>
  <div class="login-container">
      <div class="login-box">
            <div class="avatar-box">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form ref="form"  label-width="80px">
                    <el-form-item label="活动名称">
                        <el-input ></el-input>
                    </el-form-item>
            </el-form>
        </div>
 </div>
</template>

<script>
export default {
        name: 'Login'
}

</script>
<style lang="scss" scoped>
    .login-container{background:#2b4b6b;height:100%;
        .login-box{
            width:450px;height:300px;
            background:#fff;
            border-radius:6px;
            position:fixed;
            left:50%;
            top:50%;
            transform: translate3d(-50%,-50%,0);
        }
        .avatar-box{
            width:130px;
            height:130px;
            border:1px solid #eee;
            border-radius:50%;
            padding:10px;
            box-shadow:0 0 10px #ddd;
            position: absolute;
            left:50%;
            transform: translate3d(-50%,-50%, 0);
            background:#fff;
            img{
                width:100%;
                height:100%;
                border-radius:50%;
                background:#eee;
            }
        }
    }

</style>