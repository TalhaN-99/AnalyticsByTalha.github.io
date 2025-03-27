/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	// Define commonly used elements.
	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
	breakpoints({
		default:   ['1681px',   null       ],
		xlarge:    ['1281px',   '1680px'   ],
		large:     ['981px',    '1280px'   ],
		medium:    ['737px',    '980px'    ],
		small:     ['481px',    '736px'    ],
		xsmall:    ['361px',    '480px'    ],
		xxsmall:   [null,       '360px'    ]
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {
			for (var i = 0; i < this.length; i++)
				$(this[i])._parallax(intensity);
			return $this;
		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {
			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {
				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window.on('scroll._parallax', function() {
					var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);
					$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');
				});
			};

			off = function() {
				$bg
					.addClass('fixed')
					.css('transform', 'none');
				$window.off('scroll._parallax');
			};

			// Disable parallax on IE, Edge, Retina/HiDPI, and Mobile devices.
			if (browser.name == 'ie' || browser.name == 'edge' || window.devicePixelRatio > 1 || browser.mobile)
				off();
			else {
				breakpoints.on('>large', on);
				breakpoints.on('<=large', off);
			}
		});

		$window.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);
	};

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Scrolly.
	$('.scrolly').scrolly();

	// Background.
	$wrapper._parallax(0.925);

	// Nav Panel.
	$navPanelToggle = $('<a href="#navPanel" id="navPanelToggle">Menu</a>').appendTo($wrapper);

	// Change toggle styling once we've scrolled past the header.
	$header.scrollex({
		bottom: '5vh',
		enter: function() {
			$navPanelToggle.removeClass('alt');
		},
		leave: function() {
			$navPanelToggle.addClass('alt');
		}
	});

	$navPanel = $(
		'<div id="navPanel">' +
			'<nav></nav>' +
			'<a href="#navPanel" class="close"></a>' +
		'</div>'
	)
		.appendTo($body)
		.panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'right',
			target: $body,
			visibleClass: 'is-navPanel-visible'
		});

	$navPanelInner = $navPanel.children('nav');
	var $navContent = $nav.children();

	breakpoints.on('>medium', function() {
		$navContent.appendTo($nav);
		$nav.find('.icons, .icon').removeClass('alt');
	});

	breakpoints.on('<=medium', function() {
		$navContent.appendTo($navPanelInner);
		$navPanelInner.find('.icons, .icon').addClass('alt');
	});

	if (browser.os == 'wp' && browser.osVersion < 10)
		$navPanel.css('transition', 'none');

	// Intro.
	var $intro = $('#intro');

	if ($intro.length > 0) {

		// Hack: Fix flex min-height on IE.
		if (browser.name == 'ie') {
			$window.on('resize.ie-intro-fix', function() {
				var h = $intro.height();
				if (h > $window.height())
					$intro.css('height', 'auto');
				else
					$intro.css('height', h);
			}).trigger('resize.ie-intro-fix');
		}

		// Hide intro on scroll (> small).
		breakpoints.on('>small', function() {
			$main.unscrollex();
			$main.scrollex({
				mode: 'bottom',
				top: '25vh',
				bottom: '-50vh',
				enter: function() {
					$intro.addClass('hidden');
				},
				leave: function() {
					$intro.removeClass('hidden');
				}
			});
		});

		// Hide intro on scroll (<= small).
		breakpoints.on('<=small', function() {
			$main.unscrollex();
			$main.scrollex({
				mode: 'middle',
				top: '15vh',
				bottom: '-15vh',
				enter: function() {
					$intro.addClass('hidden');
				},
				leave: function() {
					$intro.removeClass('hidden');
				}
			});
		});
	}

	// --- Modal Handling for Dashboard Iframes ---
	// Ensure that your HTML includes a modal container with:
	//  - id="dashboard-modal"
	//  - an iframe with id="dashboard-iframe"
	//  - an element with class "dashboard-modal-close" for closing the modal.
	// Modal handling for dashboard iframes
	var $dashboardModal = $('#dashboard-modal');
	var $dashboardIframe = $('#dashboard-iframe');
	var $modalClose = $('.dashboard-modal-close');
	var $modalDescription = $('.dashboard-modal-description'); // New container for the description

	$('.open-dashboard-modal').on('click', function(e) {
		e.preventDefault();
		var iframeSrc = $(this).attr('data-iframe-src');
		var description = $(this).attr('data-description');
		if (iframeSrc) {
			$dashboardIframe.attr('src', iframeSrc);
			// Set the description if provided
			if (description) {
				$modalDescription.html(description);
			} else {
				$modalDescription.empty();
			}
			$dashboardModal.fadeIn();
		}
	});

	// Close modal when the close button is clicked
	$modalClose.on('click', function() {
		$dashboardModal.fadeOut(function() {
			$dashboardIframe.attr('src', '');
			$modalDescription.empty();
		});
	});

	// Close modal if clicking outside the modal content
	$dashboardModal.on('click', function(e) {
		if ($(e.target).is($dashboardModal)) {
			$dashboardModal.fadeOut(function() {
				$dashboardIframe.attr('src', '');
				$modalDescription.empty();
			});
		}
	});

	


})(jQuery);
