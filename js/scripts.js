/*!
    Title: Dev Portfolio Template
    Version: 1.2.2
    Last Change: 03/25/2020
    Author: Ryan Fitzgerald
    Repo: https://github.com/RyanFitzgerald/devportfolio-template
    Issues: https://github.com/RyanFitzgerald/devportfolio-template/issues

    Description: This file contains all the scripts associated with the single-page
    portfolio website.
*/

(function($) {
  // Show current year
  $('#current-year').text(new Date().getFullYear())

  // Remove no-js class
  $('html').removeClass('no-js')

  // Animate to section when nav is clicked
  $('header a').click(function (e) {
    // Treat as normal link if no-scroll class
    if ($(this).hasClass('no-scroll')) return

    e.preventDefault()
    var heading = $(this).attr('href')
    var scrollDistance = $(heading).offset().top  // 获取目标元素的垂直位置

    $('html, body').animate(      // 导航栏点击滚动
      {
        scrollTop: scrollDistance + 'px',   // 将页面滚动到 scrollDistance 指定的垂直位置（单位为像素）
      },
      // 300,  // 时间参数
      Math.abs(window.pageYOffset - $(heading).offset().top) / 6,    // ⚡️速度控制参数
    )

    // Hide the menu once clicked if mobile
    if ($('header').hasClass('active')) {
      $('header, body').removeClass('active')
    }
  })

  // Scroll to top
  $('#to-top').click(function () {
    $('html, body').animate(
      {
        scrollTop: 0,
      },
      500
    )
  })

  // Scroll to first element
  $('#lead-down span').click(function () {
    var scrollDistance = $('#lead').next().offset().top
    $('html, body').animate(
      {
        scrollTop: scrollDistance + 'px',
      },
      500
    )
  })

  // Create timeline
  $('#experience-timeline').each(function () {
    $this = $(this) // Store reference to this
    $userContent = $this.children('div') // user content

    // Create each timeline block
    $userContent.each(function () {
      $(this)
        .addClass('vtimeline-content')
        .wrap(
          '<div class="vtimeline-point"><div class="vtimeline-block"></div></div>'
        )
    })

    // Add icons to each block
    $this.find('.vtimeline-point').each(function () {
      $(this).prepend(
        '<div class="vtimeline-icon"><i class="fa fa-map-marker"></i></div>'
      )
    })

    // Add dates to the timeline if exists
    $this.find('.vtimeline-content').each(function () {
      var date = $(this).data('date')
      if (date) {
        // Prepend if exists
        $(this)
          .parent()
          .prepend('<span class="vtimeline-date">' + date + '</span>')
      }
    })
  })

  // Open mobile menu
  $('#mobile-menu-open').click(function () {
    $('header, body').addClass('active')
  })

  // Close mobile menu
  $('#mobile-menu-close').click(function () {
    $('header, body').removeClass('active')
  })

  // Load additional projects
  $('#view-more-projects').click(function (e) {
    e.preventDefault()
    $(this).fadeOut(300, function () {
      $('#more-projects').fadeIn(300)
    })
  })

  // 新增全局变量（放在最外层）
  let imageSet = []; // 存储所有图片数据
  let currentIndex = 0; // 当前图片索引
  // 在DOM就绪时收集所有图片数据（新增代码）
  $(document).ready(function() {
      $('.project-image .image').each(function(index) {
         $(this).data('index', index); // 将索引绑定到元素
          imageSet.push({
              alt: $(this).attr('alt'),
              title: $(this).data('title'),
              description: $(this).data('description'),
              date: $(this).data('date'),
              software: $(this).data('software'),
              author: $(this).data('author')
          });
      });
  });

  // 替换原有.click事件处理函数
  $('.project-image .image').click(function() {
      currentIndex = $(this).data('index'); // 获取预存索引
      showImage(currentIndex); // 调用统一显示函数
      $('#image-viewer').show();
  });

  // 新增图片切换函数（核心逻辑）
  function showImage(index) {
      const img = imageSet[index];
      $('#full-image').attr('src', img.alt);
      $('#image-title').text(img.title);
      $('#image-description').text(img.description);
      $('#image-date').text(img.date);
      $('#image-author').text(img.author);
      $('#image-software').text(img.software).css('font-style', 'italic');
  }

  // 新增左右按钮事件（放在ready函数内）
  $('#btn-prev').click(() => {
      currentIndex = (currentIndex - 1 + imageSet.length) % imageSet.length;
      showImage(currentIndex);
  });
  $('#btn-next').click(() => {
      currentIndex = (currentIndex + 1) % imageSet.length;
      showImage(currentIndex);
  });

  // 为文本区域绑定点击事件 - 触发同项目的图片点击
  $('.project-text').click(function() {
    // 查找同项目容器内的图片元素
    $(this).closest('.project').find('.project-image .image').click();
  });

  $('#image-viewer .close').click(function () {
    $('#image-viewer').hide()
  })

  

// 新增全局变量 - 视频数据集
let videoSet = []; // 存储所有视频数据
let currentVideoIndex = 0; // 当前视频索引

// DOM就绪时收集视频数据
$(document).ready(function() {
    // 遍历所有视频元素并存储元数据
    $('.project-video .image').each(function(index) {
        $(this).data('index', index); // 绑定索引到元素
        videoSet.push({
            src: $(this).attr('alt'), // 视频URL
            title: $(this).data('title'), // 视频标题
            description: $(this).data('description'), // 视频描述
            date: $(this).data('date'), // 创建日期
            author: $(this).data('author'), // 作者信息
            software: $(this).data('software') // 使用的软件
        });
    });

    // 视频缩略图点击事件
    $('.project-video .image').click(function() {
        currentVideoIndex = $(this).data('index');
        showVideo(currentVideoIndex);
        $('#video-viewer').show();
    });

    // 文本区域点击触发同项目视频
    $('.project-text').click(function() {
        $(this).closest('.project').find('.project-video .image').click();
    });

    // 关闭按钮事件
    $('#video-viewer .close').click(function() {
        $('#video-viewer').hide();
        $('#full-video').get(0).pause(); // 关闭时暂停播放 [7](@ref)
    });

    // 左右切换按钮事件
    $('#video-prev').click(() => {
        switchVideo(-1); // 切换到上一个视频
    });
    $('#video-next').click(() => {
        switchVideo(1); // 切换到下一个视频
    });
});

// 核心功能函数
function showVideo(index) {
    const video = videoSet[index];
    const videoElement = $('#full-video').get(0);
    
    // 更新视频源和元数据
    $('#full-video').attr('src', video.src);
    $('#video-title').text(video.title);
    $('#video-software').text(video.software).css('font-style', 'italic');
    $('#video-description').text(video.description);
    $('#video-date').text(video.date);
    $('#video-author').text(video.author);
    
    // 重置播放状态
    videoElement.currentTime = 0;
    videoElement.play(); // 自动开始播放 [1,3](@ref)
}

function switchVideo(step) {
    // 计算新索引（循环切换）
    currentVideoIndex = (currentVideoIndex + step + videoSet.length) % videoSet.length;
    showVideo(currentVideoIndex);
}
  
  // $('.project-video .image').click(function () {
  //   console.log('click')
  //   $('#full-video').attr('src', $(this).attr('alt'))
  //   $('#video-viewer').show()
  // })

  // $('#video-viewer .close').click(function () {
  //   $('#video-viewer').hide()
  // })

  // projecct glb viewer
  $('.project-glb .image').click(function () {
    console.log('click')
    $('#full-glb').attr('src', $(this).attr('alt'))
    $('#glb-viewer').show()
  })

  $('#glb-viewer .close').click(function () {
    $('#glb-viewer').hide()
  })
  
})(jQuery);
